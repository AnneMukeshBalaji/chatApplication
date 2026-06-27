package com.chatApplication.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
  @NotBlank(message = "user_name field cannot be blank")
  private String userName;
  @NotBlank(message = "password field cannot be blank")
  @Size(min = 8, message = "password field must contain atleast 8 characters")
  private String password;
}
