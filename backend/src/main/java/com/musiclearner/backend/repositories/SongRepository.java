package com.musiclearner.backend.repositories;

import com.musiclearner.backend.models.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// ¡Esto es todo! Spring crea mágicamente las sentencias SQL (INSERT, SELECT) por detrás.
@Repository
public interface SongRepository extends JpaRepository<Song, Long> {
    
    // Podemos crear nuestras propias funciones de búsqueda fácilmente
    List<Song> findByArtistContainingIgnoreCase(String artist);
    List<Song> findByTitleContainingIgnoreCase(String title);
}
