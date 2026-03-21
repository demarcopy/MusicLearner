package com.musiclearner.backend.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Permitimos llamadas desde React que corre en el puerto 5173
public class TestController {

    @GetMapping("/hello")
    public Map<String, String> sayHello() {
        return Map.of("message", "¡Conexión exitosa! El backend musical (Spring Boot) está funcionando correctamente.");
    }
}
