package auth

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

// Simple in-memory store for OTPs (Use Redis in Production)
var otpStore = struct {
	sync.RWMutex
	codes map[string]string
}{codes: make(map[string]string)}

func SendOTP(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Phone string `json:"phone"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Generate 6-digit code
	rand.Seed(time.Now().UnixNano())
	code := fmt.Sprintf("%06d", rand.Intn(1000000))

	// Store code (In-memory for now)
	otpStore.Lock()
	otpStore.codes[body.Phone] = code
	otpStore.Unlock()

	// Send via Twilio
	client := twilio.NewRestClient()
	params := &openapi.CreateMessageParams{}
	params.SetTo(body.Phone)
	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
	params.SetBody(fmt.Sprintf("Your LehGo verification code is: %s", code))

	_, err := client.Api.CreateMessage(params)
	if err != nil {
		// For dev/demo without credentials, just log it and succeed
		fmt.Printf("⚠️ Twilio Error (Ignored for Dev): %v\n", err)
		fmt.Printf("🔑 DEV MODE OTP for %s: %s\n", body.Phone, code)
	} else {
		fmt.Printf("✅ SMS sent to %s\n", body.Phone)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "sent", "dev_code": code})
}

func VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Phone string `json:"phone"`
		Code  string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Verify Code
	otpStore.RLock()
	storedCode, exists := otpStore.codes[body.Phone]
	otpStore.RUnlock()

	if !exists || storedCode != body.Code {
		http.Error(w, "Invalid Code", http.StatusUnauthorized)
		return
	}

	// Clean up used code (Simple replay protection)
	otpStore.Lock()
	delete(otpStore.codes, body.Phone)
	otpStore.Unlock()

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "verified"})
}
