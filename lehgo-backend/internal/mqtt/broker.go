package mqtt

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/mochi-mqtt/server/v2/hooks/auth"
	"github.com/mochi-mqtt/server/v2/listeners"
)

var Server *mqtt.Server

func Publish(topic string, payload []byte) {
	if Server != nil {
		Server.Publish(topic, payload, false, 0)
		log.Printf("📡 MQTT Broadcast: %s -> %s", topic, string(payload))
	}
}

func StartBroker() {
	// Create the new MQTT Server.
	Server = mqtt.New(nil)

	// Allow all connections.
	_ = Server.AddHook(new(auth.AllowHook), nil)

	// Create a TCP listener on a standard port.
	tcp := listeners.NewTCP(listeners.Config{
		ID:      "t1",
		Address: ":1883",
	})
	err := Server.AddListener(tcp)
	if err != nil {
		log.Fatal(err)
	}

	// Create a WebSockets listener for the Mobile App.
	ws := listeners.NewWebsocket(listeners.Config{
		ID:      "ws1",
		Address: ":8083",
	})
	err = Server.AddListener(ws)
	if err != nil {
		log.Fatal(err)
	}

	go func() {
		err := Server.Serve()
		if err != nil {
			log.Fatal(err)
		}
	}()

	log.Println("✅ LehGo MQTT Broker Live: TCP(:1883) & WS(:8083)")

	// Wait for signal
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	<-sigs
}
