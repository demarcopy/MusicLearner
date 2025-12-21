package com.musiclearner.dto;

public class SongsterrSongDTO {

    private Long id;
    private String title;
    private ArtistDTO artist;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public ArtistDTO getArtist() {
        return artist;
    }

    public static class ArtistDTO {
        private String name;

        public String getName() {
            return name;
        }
    }
}
