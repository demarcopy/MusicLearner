package com.musiclearner.backend.controllers;

import com.musiclearner.backend.models.Song;
import com.musiclearner.backend.services.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "http://localhost:5173") // Permitimos llamadas del Front-End
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    // Cuando el frontend llame GET HTTP://.../api/songs, devuelve la lista
    @GetMapping
    public List<Song> getAllSongs() {
        return songService.getAllSongs();
    }

    // Para ver solo una canción (/api/songs/1)
    @GetMapping("/{id}")
    public ResponseEntity<Song> getSongById(@PathVariable Long id) {
        return songService.getSongById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Para guardar una canción nueva en la base de datos (POST)
    @PostMapping
    public Song createSong(@RequestBody Song song) {
        return songService.saveSong(song);
    }

    // Para borrar una canción
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
        return ResponseEntity.noContent().build();
    }
}
