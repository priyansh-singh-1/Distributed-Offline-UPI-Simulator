package com.example.demo.dto;

import lombok.Data;

@Data
public class RelayAuthorizeRequest {

    private String relayNodeId;
    private  Boolean internetAvailable;

}
