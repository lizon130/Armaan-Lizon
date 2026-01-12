    <script>
      const $ = (s) => document.querySelector(s);
      $("#year").textContent = new Date().getFullYear();

      // Create AI particles background
      function createAIParticles() {
        const container = document.getElementById("aiParticles");
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.className = "ai-particle";

          // Random position
          const left = Math.random() * 100;
          const top = Math.random() * 100;

          particle.style.left = `${left}%`;
          particle.style.top = `${top}%`;

          // Random size
          const size = Math.random() * 3 + 1;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;

          // Random animation
          const duration = Math.random() * 20 + 10;
          const delay = Math.random() * 5;

          particle.style.animation = `float ${duration}s ${delay}s infinite linear`;

          // Add to container
          container.appendChild(particle);
        }

        // Add CSS for floating animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes float {
              0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              90% {
                opacity: 1;
              }
              100% {
                transform: translate(${Math.random() * 100 - 50}px, ${
          Math.random() * 100 - 50
        }px) rotate(360deg);
                opacity: 0;
              }
            }
          `;
        document.head.appendChild(style);
      }

      createAIParticles();

      $("#downloadResume").addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = "/resume.pdf";
        a.download = "MD_Arman_Haque_Lizon_Resume.pdf";
        a.click();
      });

      $("#contactForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const mail = $("#email").value;
        const msg = $("#message").value;
        window.location.href = `mailto:armanhaqcse@gmail.com?subject=Portfolio Contact from ${mail}&body=${encodeURIComponent(
          msg
        )}`;
        $("#formMsg").textContent =
          "Mail client opened — or email me at armanhaqcse@gmail.com";
      });

      $("#aiSuggest").addEventListener("click", () => {
        const topics = [
          "AI automation",
          "Laravel backend",
          "SQL optimization",
          "C# web app",
        ];
        const pick = topics[Math.floor(Math.random() * topics.length)];
        $(
          "#formMsg"
        ).textContent = `Hi Arman, I'm interested in your ${pick} expertise. Can we collaborate?`;

        // Add AI typing effect
        const formMsg = $("#formMsg");
        formMsg.style.opacity = "0";
        setTimeout(() => {
          formMsg.style.transition = "opacity 0.3s";
          formMsg.style.opacity = "1";
        }, 10);
      });

      $("#genBio").addEventListener("click", () => {
        const topic = $("#bioTopic").value || "Laravel and AI";
        const bios = [
          `Arman is a seasoned developer specializing in ${topic}, combining backend precision with AI intelligence to create efficient solutions.`,
          `Expert in ${topic}, Arman integrates smart algorithms and robust codebases to build scalable web applications.`,
          `MD. Arman Haque Lizon delivers enterprise-grade ${topic} solutions infused with automation and AI adaptability.`,
        ];
        const bioOut = $("#bioOut");
        bioOut.textContent = "";

        // Add typing effect
        const selectedBio = bios[Math.floor(Math.random() * bios.length)];
        let i = 0;
        const typeWriter = () => {
          if (i < selectedBio.length) {
            bioOut.textContent += selectedBio.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
          }
        };
        typeWriter();
      });

      $("#contactBtn").addEventListener(
        "click",
        () => (location.href = "#contact")
      );

      // Add hover effects to all feature cards
      document.querySelectorAll(".feature").forEach((card) => {
        card.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-5px)";
        });

        card.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0)";
        });
      });

      // Free AI API using Hugging Face Inference API
      const AI_API_URL =
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

      // Enhanced fallback responses for various topics
      const enhancedFallbacks = {
        life: "Eya is the love of arman's life.",
        heda: "Eya's favourite Quotes - ইয়ার পছন্দের একটা শব্দ",
        programming:
          "That's a great programming question! In software development, it's crucial to write clean, maintainable code and follow best practices. Consider using version control, writing tests, and documenting your code properly.",
        laravel:
          "For Laravel development, I recommend using Eloquent efficiently, implementing proper validation, and leveraging Laravel's built-in features like middleware, events, and queues. The Laravel ecosystem has excellent packages for almost any need.",
        php: "Modern PHP development emphasizes type declarations, proper error handling, and using Composer for dependency management. PHP 8+ offers great features like attributes, union types, and match expressions.",
        database:
          "Database design should focus on normalization, proper indexing, and efficient querying. Consider using database migrations, and for performance, look into caching and query optimization techniques.",
        ai: "AI integration can range from simple API calls to complex machine learning models. Start with pre-trained models or APIs, then explore custom training as needed. Popular options include OpenAI, TensorFlow, and PyTorch.",
        net: ".NET development benefits from strong typing, LINQ for data manipulation, and Entity Framework for database operations. The .NET ecosystem is excellent for enterprise applications and web APIs.",
        javascript:
          "Modern JavaScript development involves ES6+ features, async/await, and module systems. Consider using frameworks like React or Vue for complex UIs, and Node.js for server-side development.",
        project:
          "When planning a project, start with clear requirements, choose appropriate technologies, set up CI/CD pipelines, and plan for testing and deployment from the beginning.",
        career:
          "In tech careers, continuous learning is key. Build a strong portfolio, contribute to open source, network with other developers, and stay updated with industry trends.",
        default:
          "That's an interesting question! In technology, the best approach often depends on your specific use case and constraints. Would you like me to elaborate on any particular aspect?",
      };

      let conversationHistory = [];

      async function sendMessage() {
        const input = document.getElementById("aiChatInput");
        const message = input.value.trim();
        const chatMessages = document.getElementById("aiChatMessages");
        const sendButton = document.getElementById("sendButton");
        const btnText = sendButton.querySelector(".btn-text");
        const btnLoader = sendButton.querySelector(".btn-loader");
        const typingIndicator = document.getElementById("typingIndicator");

        if (!message) return;

        // Add user message to chat
        addMessageToChat("user", message);
        input.value = "";

        // Show typing indicator
        typingIndicator.style.display = "flex";
        sendButton.disabled = true;
        btnText.style.display = "none";
        btnLoader.style.display = "block";

        try {
          // Try to get AI response
          const aiResponse = await getAIResponse(message);
          addMessageToChat("ai", aiResponse);
        } catch (error) {
          console.error("AI Error:", error);
          // Use enhanced fallback
          const fallbackResponse = getEnhancedFallback(message);
          addMessageToChat("ai", fallbackResponse);
        }

        // Hide typing indicator and reset button
        typingIndicator.style.display = "none";
        sendButton.disabled = false;
        btnText.style.display = "block";
        btnLoader.style.display = "none";
      }

      function addMessageToChat(sender, message) {
        const chatMessages = document.getElementById("aiChatMessages");

        const messageDiv = document.createElement("div");
        messageDiv.className = `${sender}-message message`;

        const avatarDiv = document.createElement("div");
        avatarDiv.className = "message-avatar";
        avatarDiv.textContent = sender === "ai" ? "AI" : "You";

        const contentDiv = document.createElement("div");
        contentDiv.className = "message-content";
        contentDiv.innerHTML = message.replace(/\n/g, "<br>");

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to conversation history
        conversationHistory.push({ sender, message });
      }

      async function getAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // FIRST check for HEDA question - return static response immediately
        if (
          lowerMessage.includes("heda") ||
          lowerMessage.includes("what is heda")
        ) {
          return "Eya's favourite Quotes - ইয়ার পছন্দের একটা শব্দ ";
        }
        if (
          lowerMessage.includes("life") ||
          lowerMessage.includes("Who is Armans Life?")
        ) {
          return "Eya is the love of arman's life.";
        }
        if (
          lowerMessage.includes("eya") ||
          lowerMessage.includes("Who is Eya?")
        ) {
          return "Eya is a beautiful soul who holds a special place in Arman's heart.";
        }
        if (
          lowerMessage.includes("education") ||
          lowerMessage.includes("what eya does?")
        ) {
          return "Eya is a student of BBA in University Of Asia Pacific.";
        }
        if (
          lowerMessage.includes("arman") ||
          lowerMessage.includes("who is arman?")
        ) {
          return "Arman is a dedicated software developer specializing in PHP, Laravel, .NET, and AI integrations. He lives in Dhaka, Bangladesh, and works at Tusuka Group.";
        }
        if (
          lowerMessage.includes("projects") ||
          lowerMessage.includes("what types of project arman does?")
        ) {
          return "Arman works on AI-powered web applications, CRM systems, inventory management tools, and chatbots using technologies like PHP, Laravel, C#, .NET, SQL, and JavaScript.";
        }

        try {
          // Try Hugging Face API first
          const response = await fetch(AI_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: {
                text: `Conversation history: ${conversationHistory
                  .slice(-3)
                  .map((msg) => `${msg.sender}: ${msg.message}`)
                  .join(" | ")}
            
            You are a helpful AI assistant specializing in web development, programming, and technology. Provide practical, concise advice.
            
            User: ${userMessage}
            AI:`,
              },
            }),
          });

          if (!response.ok) {
            throw new Error("API not available");
          }

          const data = await response.json();

          if (data && data.generated_text) {
            return data.generated_text;
          } else {
            throw new Error("No response from AI");
          }
        } catch (error) {
          // If Hugging Face fails, try alternative free API
          return await tryAlternativeAI(userMessage);
        }
      }

      async function tryAlternativeAI(userMessage) {
        try {
          // Alternative: Use OpenAI-compatible free service
          const response = await fetch(
            "https://api.deepinfra.com/v1/openai/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "mistralai/Mistral-7B-Instruct-v0.1",
                messages: [
                  {
                    role: "system",
                    content:
                      "You are a helpful AI assistant that provides practical programming and web development advice. Be concise and helpful.",
                  },
                  {
                    role: "user",
                    content: userMessage,
                  },
                ],
                max_tokens: 150,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
          } else {
            throw new Error("Alternative API failed");
          }
        } catch (error) {
          throw error; // Will be caught by main function to use fallback
        }
      }

      function getEnhancedFallback(message) {
        const lowerMessage = message.toLowerCase();

        // Check for specific Heda question
        if (
          lowerMessage.includes("heda") ||
          lowerMessage.includes("what is heda")
        ) {
          return "Eya's favourite Quotes ";
        }

        // Check for other keywords in the message
        const keywords = Object.keys(enhancedFallbacks);
        for (const keyword of keywords) {
          if (lowerMessage.includes(keyword)) {
            return enhancedFallbacks[keyword];
          }
        }

        return enhancedFallbacks.default;
      }

      function askQuickQuestion(question) {
        document.getElementById("aiChatInput").value = question;
        sendMessage();
      }

      // Allow Enter key to send message
      document
        .getElementById("aiChatInput")
        .addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            sendMessage();
          }
        });

      // Example questions for demonstration
      const exampleQuestions = [
        "How do I optimize Laravel performance?",
        "What's the best way to learn AI programming?",
        "How to design a scalable database architecture?",
        "What are the latest trends in web development?",
        "How to secure a PHP application?",
        "What's the difference between REST and GraphQL?",
        "How to deploy a .NET application?",
        "What are some good practices for React development?",
      ];