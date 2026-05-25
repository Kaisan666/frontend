"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./ReviewForm.module.scss"

type Status = "idle" | "submitting" | "success" | "error"

export const ReviewForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [authorName, setAuthorName] = useState("")
  const [text, setText] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Время mount-а формы — используется на сервере как часть anti-bot проверки.
  // Перезаписывается при каждом открытии формы.
  const mountedAtRef = useRef<number>(Date.now())

  // Honeypot — скрытое поле "website". Человек его не заполняет, бот заполняет.
  const honeypotRef = useRef<HTMLInputElement>(null)

  // При открытии — обновляем timestamp и фокусим первое поле.
  const nameInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) {
      mountedAtRef.current = Date.now()
      nameInputRef.current?.focus()
    }
  }, [isOpen])

  const isValid = authorName.trim().length >= 2 && text.trim().length >= 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || status === "submitting") return

    setStatus("submitting")
    setErrorMessage(null)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName.trim(),
          text: text.trim(),
          website: honeypotRef.current?.value ?? "",
          formMountedAt: mountedAtRef.current,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? "Не удалось отправить отзыв")
      }

      setStatus("success")
      setAuthorName("")
      setText("")
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Ошибка отправки")
    }
  }

  if (!isOpen) {
    return (
      <div className={styles["review-form__toggle"]}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`${styles["review-form__open"]} accent-button`}
        >
          Оставить отзыв
        </button>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className={styles["review-form"]}>
        <p className={styles["review-form__success"]}>
          Спасибо! Отзыв отправлен на модерацию — появится на сайте после
          проверки.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle")
            setIsOpen(false)
          }}
          className={styles["review-form__close"]}
        >
          Закрыть
        </button>
      </div>
    )
  }

  return (
    <form className={styles["review-form"]} onSubmit={handleSubmit} noValidate>
      <div className={styles["review-form__header"]}>
        <h3 className={styles["review-form__title"]}>Оставить отзыв</h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className={styles["review-form__close"]}
          aria-label="Закрыть форму"
        >
          ✕
        </button>
      </div>

      <label className={styles["review-form__field"]}>
        <span className={styles["review-form__label"]}>Имя</span>
        <input
          ref={nameInputRef}
          type="text"
          className={styles["review-form__input"]}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={60}
          required
          disabled={status === "submitting"}
        />
      </label>

      <label className={styles["review-form__field"]}>
        <span className={styles["review-form__label"]}>Отзыв</span>
        <textarea
          className={styles["review-form__textarea"]}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          minLength={10}
          maxLength={1000}
          required
          disabled={status === "submitting"}
        />
        <span className={styles["review-form__counter"]}>
          {text.length} / 1000
        </span>
      </label>

      {/* Honeypot — спрятано через aria + inline-стили, не tab-focusable. */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      />

      {errorMessage && (
        <p className={styles["review-form__error"]} role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className={`${styles["review-form__submit"]} accent-button`}
        disabled={!isValid || status === "submitting"}
      >
        {status === "submitting" ? "Отправляем…" : "Отправить"}
      </button>
    </form>
  )
}
