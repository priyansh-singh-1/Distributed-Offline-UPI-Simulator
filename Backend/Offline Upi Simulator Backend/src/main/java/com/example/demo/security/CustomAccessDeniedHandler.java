package com.example.demo.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public CustomAccessDeniedHandler(ObjectMapper objectMapper){
        this.objectMapper=objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, SecurityException {
response.setStatus(HttpServletResponse.SC_FORBIDDEN);
response.setContentType("application/json");

        Map<String,Object> body= new LinkedHashMap<>();

        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status",403);
        body.put("error","Forbidden");
        body.put(
                "message",
                "You do not have permission to access this resource"
        );
        body.put("path",request.getRequestURI());

        objectMapper.writeValue(
                response.getOutputStream(),
                body
        );
    }

}
