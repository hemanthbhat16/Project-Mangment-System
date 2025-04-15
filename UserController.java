package com.example.project_management.controller;

import com.example.project_management.model.User;
import com.example.project_management.repository.UserRepository;
import com.example.project_management.service.*;
import com.example.project_management.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    // private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // @PostMapping("/signup")
    // @PreAuthorize("hasRole('ADMIN')")
    // public ResponseEntity<?> signupUser(@RequestBody User user, @RequestHeader("Authorization") String authHeader) {
    //     String token = authHeader.substring(7);
    //     String role = jwtUtil.extractRole(token);

    //     if(!role.equalsIgnoreCase("ADMIN")) {
    //         return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admin can create users");
    //     }
    //     if(userRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
    //         return ResponseEntity.badRequest().body("Email already exists");
    //     }
        
    //     user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
    //     userRepository.save(user);
    //     return ResponseEntity.ok("User registered successfully");
    // }

    @PostMapping("signup")
    public ResponseEntity<?> signupUser(@RequestBody User user) {
        if(!user.getRole().equalsIgnoreCase("Admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only users with role 'Admin' can sign up");
        }

        if(userRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Admin registered successfully");
    }



@PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody Map<String, String> userData) {
    String email = userData.get("email");
    String password = userData.get("password");

    System.out.println("Trying login with email: " + email);
    System.out.println("Password entered: " + password);
    
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    System.out.println("DB Password: " + user.getPassword());

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    if (!encoder.matches(password, user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid password");
    }

    String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(
        user.getEmail(),
        user.getPassword(),
        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()))
    ));

    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("email", user.getEmail());
    response.put("role", user.getRole());
    
    return ResponseEntity.ok(response);
    //     try{
    //         System.out.println("Step A");
    //         authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(userData.get("email"), userData.get("password"))
    //         );
    //         System.out.println("Step B");
    //     }
    //  catch (BadCredentialsException e) {
    //     e.printStackTrace();
    //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    // } 
    // catch (Exception e) {
    //     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong: " + e.getMessage());
    // }
        // catch(Exception e) {
        //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        // }

        // final UserDetails userDetails = customUserDetailsService.loadUserByUsername(userData.get("email"));
        // final String token = jwtUtil.generateToken(userDetails);

        // Map<String, Object> response = new HashMap<>();
        // response.put("token", token);
        // response.put("email", userDetails.getUsername());

        // return ResponseEntity.ok(response);
    }

    @PostMapping("/create-admin-temp")
    public ResponseEntity<?> createInitialAdmin() {
        if (userRepository.findByEmailIgnoreCase("admin@example.com").isPresent()) {
            return ResponseEntity.badRequest().body("Admin already exists");
        }
    
        User user = new User();
        user.setEmail("admin@example.com");
        user.setPassword(new BCryptPasswordEncoder().encode("admin123"));
        user.setRole("Admin");
    
        userRepository.save(user);
        return ResponseEntity.ok("Admin user created with email: admin@example.com and password: admin123");
    }    

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/add")
    // @PreAuthorize("hasRole('Admin')")
    public ResponseEntity <?> addMember(@RequestBody User user) {
        if(userRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        return ResponseEntity.ok(userRepository.save(user));
    }
    
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity <?> deleteUser(@PathVariable Long id) {
        if(!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("User not found");
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping("/user") 
        public ResponseEntity<List<User>> getAll() {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        }
}