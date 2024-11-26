package com.bzw875.treehole.controller;

import com.bzw875.treehole.UserService;
import com.bzw875.treehole.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;
import com.bzw875.treehole.config.JwtUtil;

@RestController
@RequestMapping("/api")
public class AppController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestParam("username") String username, @RequestParam("password") String password) {
        User user = userService.findByUsername(username);

        if (user == null || !password.equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return ResponseEntity.ok(new AuthResponse(token));
    }

}


class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}