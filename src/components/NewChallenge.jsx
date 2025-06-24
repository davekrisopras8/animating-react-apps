import { useContext, useRef, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

import { ChallengesContext } from "../store/challenges-context.jsx";
import Modal from "./Modal.jsx";
import images from "../assets/images.js";

export default function NewChallenge({ onDone }) {
  const title = useRef();
  const description = useRef();
  const deadline = useRef();

  const [scope, animate] = useAnimate();

  const [selectedImage, setSelectedImage] = useState(null);
  const { addChallenge } = useContext(ChallengesContext);

  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const challenge = {
      title: title.current.value,
      description: description.current.value,
      deadline: deadline.current.value,
      image: selectedImage,
    };

    // Debug: Log untuk memastikan validasi berjalan
    console.log("Challenge data:", challenge);
    console.log("Validation check:", {
      title: !challenge.title.trim(),
      description: !challenge.description.trim(),
      deadline: !challenge.deadline.trim(),
      image: !challenge.image
    });

    if (
      !challenge.title.trim() ||
      !challenge.description.trim() ||
      !challenge.deadline.trim() ||
      !challenge.image
    ) {
      console.log("Validation failed, triggering animation");

      // Metode shake animation dengan sequence
      try {
        // Shake ke kiri
        await animate(
          "input, textarea",
          {
            x: -10,
            borderColor: "#ff4f4f"
          },
          {
            type: "spring",
            duration: 0.1,
            delay: stagger(0.05)
          }
        );

        // Shake ke kanan
        await animate(
          "input, textarea",
          {
            x: 10
          },
          {
            type: "spring",
            duration: 0.1
          }
        );

        // Kembali ke posisi normal
        await animate(
          "input, textarea",
          {
            x: 0,
            borderColor: "#d9e2f1"
          },
          {
            type: "spring",
            duration: 0.2
          }
        );

      } catch (error) {
        console.log("Animation error:", error);

        // Metode 2: Fallback dengan tween animation
        animate(
          "input, textarea",
          {
            x: [0, -10, 10, -5, 5, 0],
            borderColor: "#ff4f4f"
          },
          {
            type: "tween",
            duration: 0.5,
            delay: stagger(0.1)
          }
        );

        // Reset border color
        setTimeout(() => {
          animate(
            "input, textarea",
            { borderColor: "#d9e2f1" },
            { type: "tween", duration: 0.3 }
          );
        }, 600);
      }

      return;
    }

    console.log("Validation passed, adding challenge");
    onDone();
    addChallenge(challenge);
  }

  return (
    <Modal title="New Challenge" onClose={onDone}>
      <form id="new-challenge" onSubmit={handleSubmit} ref={scope}>
        <p>
          <label htmlFor="title">Title</label>
          <input
            ref={title}
            type="text"
            name="title"
            id="title"
            style={{ transition: "border-color 0.3s ease" }}
          />
        </p>

        <p>
          <label htmlFor="description">Description</label>
          <textarea
            ref={description}
            name="description"
            id="description"
            style={{ transition: "border-color 0.3s ease" }}
          />
        </p>

        <p>
          <label htmlFor="deadline">Deadline</label>
          <input
            ref={deadline}
            type="date"
            name="deadline"
            id="deadline"
            style={{ transition: "border-color 0.3s ease" }}
          />
        </p>

        <motion.ul
          id="new-challenge-images"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {images.map((image) => (
            <motion.li
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              key={image.alt}
              onClick={() => handleSelectImage(image)}
              className={selectedImage === image ? "selected" : undefined}
            >
              <img {...image} />
            </motion.li>
          ))}
        </motion.ul>

        <p className="new-challenge-actions">
          <button type="button" onClick={onDone}>
            Cancel
          </button>
          <button type="submit">Add Challenge</button>
        </p>
      </form>
    </Modal>
  );
}
