package main

import (
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("dist"))
	http.Handle("/p2pfs/", http.StripPrefix("/p2pfs/", fs))
	http.ListenAndServe(":8080", nil)
}