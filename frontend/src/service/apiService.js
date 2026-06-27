// ── REST API Service ─────────────────────────────────────────────
// Stubs only. In integration round, uncomment fetch calls and point
// BASE_URL at your Spring Boot server.

const BASE_URL = 'http://localhost:8080/api'

export const apiService = {
  login: async (username, _password) => {
    // TODO: POST ${BASE_URL}/auth/login
    return { success: true, token: 'mock-jwt', user: { username } }
  },

  register: async (displayName, username, _password) => {
    // TODO: POST ${BASE_URL}/auth/register
    return { success: true, token: 'mock-jwt', user: { username, displayName } }
  },

  logout: async () => {
    // TODO: POST ${BASE_URL}/auth/logout
    return { success: true }
  },

  getUsers: async () => MOCK_USERS,

  getHistory: async (userId) => MOCK_MESSAGES[userId] || [],

  sendMessage: async (_recipientId, _content) => {
    // TODO: POST ${BASE_URL}/messages/send
    return { id: Date.now(), status: 'PENDING' }
  },
}

// ── WebSocket Service ────────────────────────────────────────────
// Wire up SockJS + STOMP in integration round.
export const wsService = {
  connect: (_token, _onMessage, _onStatus, _onPresence) => {
    // const socket = new SockJS(`${BASE_URL}/ws`)
    // const client = Stomp.over(socket)
    // client.connect({ Authorization: `Bearer ${_token}` }, () => {
    //   client.subscribe('/user/queue/messages', _onMessage)
    //   client.subscribe('/user/queue/status',   _onStatus)
    //   client.subscribe('/topic/presence',      _onPresence)
    // })
  },
  disconnect:   () => {},
  sendMessage:  (_recipientId, _content)  => {},
  markDelivered:(_messageId)              => {},
  markRead:     (_messageId)              => {},
}

// ── Mock data ────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 1, name: 'Sara Williams',   initial: 'S', online: true,  time: '2m',  preview: 'Sounds great! 👍',   unread: 2 },
  { id: 2, name: 'Marcus Chen',     initial: 'M', online: true,  time: '15m', preview: 'Can we reschedule?',  unread: 0 },
  { id: 3, name: 'Priya Patel',     initial: 'P', online: false, time: '1h',  preview: 'Thanks for the help', unread: 0 },
  { id: 4, name: 'James K.',        initial: 'J', online: true,  time: '3h',  preview: 'On my way!',          unread: 1 },
  { id: 5, name: 'Elena Rodriguez', initial: 'E', online: false, time: 'Sun', preview: 'See you then',        unread: 0 },
]

export const MOCK_MESSAGES = {
  1: [
    { id: 1, from: 'them', text: 'Hey! Are you free tomorrow afternoon?',  time: '10:22 AM', status: null },
    { id: 2, from: 'me',   text: 'Yes, after 2pm works for me.',           time: '10:24 AM', status: 'READ' },
    { id: 3, from: 'them', text: "Perfect. Let's meet at the usual place?",time: '10:25 AM', status: null },
    { id: 4, from: 'me',   text: 'Sounds great! 👍',                       time: '10:26 AM', status: 'DELIVERED' },
  ],
  2: [
    { id: 5, from: 'me',   text: 'Hey Marcus, the meeting is at 3pm.',     time: '9:00 AM',  status: 'READ' },
    { id: 6, from: 'them', text: 'Can we reschedule? Something came up.',  time: '9:15 AM',  status: null },
  ],
  3: [
    { id: 7, from: 'me',   text: 'Did you get the files I sent?',          time: 'Yesterday',status: 'READ' },
    { id: 8, from: 'them', text: 'Thanks for the help',                    time: 'Yesterday',status: null },
  ],
}
