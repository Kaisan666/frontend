"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { usePopup } from "@/app/context/PopupContext";
import styles from "./EventButton.module.scss";

type Props = {
  count: number;
};

const EventButton = ({ count }: Props) => {
  const { setIsOpen } = usePopup()!;

  if (count <= 0) return null;

  return (
    <button
      type="button"
      className={styles["event-fab"]}
      onClick={() => setIsOpen(true)}
      aria-label={`События в баре, открыть (${count})`}
    >
      <Calendar size={20} strokeWidth={2} aria-hidden="true" />
      <span className={styles["event-fab__badge"]} aria-hidden="true">
        {count > 9 ? "9+" : count}
      </span>
    </button>
  );
};

export default EventButton;
