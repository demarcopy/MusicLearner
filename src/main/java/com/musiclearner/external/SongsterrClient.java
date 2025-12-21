package com.musiclearner.external;

import com.musiclearner.dto.SongsterrSongDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
public class SongsterrClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public List<SongsterrSongDTO> search(String query) {
        String url = "https://www.songsterr.com/a/ra/songs.json?pattern=" + query;

        SongsterrSongDTO[] result =
                restTemplate.getForObject(url, SongsterrSongDTO[].class);

        return Arrays.asList(result);
    }
}
