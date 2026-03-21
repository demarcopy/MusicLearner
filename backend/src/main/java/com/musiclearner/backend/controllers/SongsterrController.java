package com.musiclearner.backend.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/songsterr")
@CrossOrigin(origins = "http://localhost:5173")
public class SongsterrController {

    // RestTemplate es la herramienta de Spring Boot para hacer peticiones a OTROS servidores de internet
    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/search")
    public String searchTabs(@RequestParam String pattern) {
        // La URL secreta de Songsterr V2
        String url = "https://www.songsterr.com/api/songs?pattern=" + pattern;
        
        // Magia: Java como "servidor" va y pide los datos.
        // Como Java NO es un navegador (como Chrome), Songsterr NO bloquea la petición por CORS.
        // Devuelve el JSON tal cual se lo entregaron a nuestra app en React.
        return restTemplate.getForObject(url, String.class);
    }
}
