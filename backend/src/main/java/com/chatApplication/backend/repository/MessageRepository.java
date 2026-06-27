package com.chatApplication.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.chatApplication.backend.entity.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
  // NOTE: @Query annotation let's you write custom JPQL QUERY NOT SQL QUERY SO
  // USE CLASS NAME HIBERNATE WILL CONVERT UNDER THE HOOD
  @Query("SELECT m FROM Message m WHERE(m.sender.id = ?1 AND m.recipient.id = ?2) OR (m.sender.id = ?2 AND m.recipient.id = ?1) ORDER BY m.timeStamp")
  List<Message> findConversation(UUID user1, UUID user2);
}
