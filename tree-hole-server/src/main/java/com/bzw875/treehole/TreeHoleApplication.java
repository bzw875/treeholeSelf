package com.bzw875.treehole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TreeHoleApplication {

	public static void main(String[] args) {
		SpringApplication.run(TreeHoleApplication.class, args);
	}

}
