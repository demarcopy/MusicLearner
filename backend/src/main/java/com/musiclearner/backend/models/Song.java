package com.musiclearner.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String artist;
    
    @Column(columnDefinition = "TEXT")
    private String content; // Acordes manuales, si los hubiera
    
    // NUEVO: Guardaremos el ID directo de la API de Songsterr
    private Long songsterrId;

    public Song() {}

    public Song(String title, String artist, String content, Long songsterrId) {
        this.title = title;
        this.artist = artist;
        this.content = content;
        this.songsterrId = songsterrId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Long getSongsterrId() { return songsterrId; }
    public void setSongsterrId(Long songsterrId) { this.songsterrId = songsterrId; }
}
