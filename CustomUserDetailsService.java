// package com.example.project_management.service;

// import com.example.project_management.model.User;
// import com.example.project_management.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.userdetails.*;
// import org.springframework.stereotype.Service;

// import java.util.*;

// @Service
// public class CustomUserDetailsService implements UserDetailsService {

//     @Autowired
//     private UserRepository userRepository;

//     @Override
//     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//         User user = userRepository.findByEmailIgnoreCase(email)
//              .orElseThrow(() -> new UsernameNotFoundException("User not found"));

//         System.out.println("Loaded user: " + user.getEmail() + " -> " + user.getPassword());
             
//         return new org.springframework.security.core.userdetails.User(
//               user.getEmail(),
//               user.getPassword(),
//               List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()))
//         );
//     }
// }

package com.example.project_management.service;

import com.example.project_management.model.User;
import com.example.project_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailIgnoreCase(email)
             .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
              user.getEmail(),
              user.getPassword(),
              List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase()))
        );
    }
}

