package com.bzw875.treehole;

import com.bzw875.treehole.model.User;
import com.bzw875.treehole.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }


    public void saveUser(User user) {
        userRepository.save(user);
    }
    public void deleteUser(User user) {
        userRepository.delete(user);
    }

    public Iterable<User> findAll() {
        return userRepository.findAll();
    }
}