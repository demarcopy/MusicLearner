package com.musiclearner.backend.services;

import com.musiclearner.backend.models.Song;
import com.musiclearner.backend.repositories.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    // Traer toda la biblioteca
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    // Buscar una por su ID (ej. canción Nº 5)
    public Optional<Song> getSongById(Long id) {
        return songRepository.findById(id);
    }

    // Guardar o actualizar una canción
    public Song saveSong(Song song) {
        return songRepository.save(song);
    }

    // Eliminar
    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
}
