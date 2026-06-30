package com.chatApplication.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
  @NotBlank(message = "Current password cannot be empty")
  private String oldPassword;
  @NotBlank(message = "New password cannot be empty")
  @Size(min = 8, message = "New password must be at least 8 characters")
  private String newPassword;
}
