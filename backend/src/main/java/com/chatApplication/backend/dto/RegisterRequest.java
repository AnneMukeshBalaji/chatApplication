package com.chatApplication.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
  @NotBlank(message = "user_name cannot be empty")
  private String userName;
  @NotBlank(message = "password cannot be empty")
  @Size(min = 8, message = "password field must be atleast 8 characters length")
  private String password;
  @Email(message = "Invalid Email ")
  @NotBlank(message = "Email field cannot be empty")
  private String email;
}
