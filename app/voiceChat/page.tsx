'use client';

export default function VoiceChat() {
  return (
    <div style={styles.container}>

      {/* Left Section */}
      <aside style={styles.sidebar}>
        <h3>Menu</h3>
        <p>Dashboard</p>
        <p>Upload Image</p>
        <p>History</p>
      </aside>

      {/* Main Section */}
      <main style={styles.main}>
        <h2>Cattle & Buffalo Recognition</h2>

        <div style={styles.imageBox}>
          <p>Upload Image</p>
          <button style={styles.button}>Upload</button>
        </div>

        <p style={{ marginTop: "20px" }}>
          AI will identify cattle or buffalo from the image.
        </p>
      </main>

      {/* AI Chat Section */}
      <aside style={styles.chat}>
        <h3>AI Assistant</h3>

        <div style={styles.chatBox}>
          AI: Hello! How can I help you?
        </div>

        <input
            style={styles.input}
            placeholder="Ask AI..."
        />
        <button style={styles.button}>Send</button>
      </aside>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "calc(100vh - 70px)", // navbar height
  },
  sidebar: {
    width: "18%",
    backgroundColor: "#111827",
    color: "white",
    padding: "20px",
  },
  main: {
    width: "54%",
    padding: "40px",
    backgroundColor: "#f9fafb",
  },
  imageBox: {
    border: "2px dashed #9ca3af",
    padding: "40px",
    textAlign: "center" as const,
    marginTop: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  chat: {
    width: "28%",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  },
  chatBox: {
    height: "60%",
    backgroundColor: "white",
    padding: "10px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};