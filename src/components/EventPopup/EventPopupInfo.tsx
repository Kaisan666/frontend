"use client";
import React from "react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import styles from "./EventPopupInfo.module.scss";

type EventItem = {
  _id: string;
  title?: string;
  startDate?: string;
  imageUrl?: string;
  body?: any;
};

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => (
      <Image
        src={value.asset.url}
        alt={value.alt || ""}
        width={800}
        height={500}
      />
    ),
  },
};

const formatDate = (iso?: string) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
};

export const EventPopupInfo = ({ events }: { events: EventItem[] }) => {
  if (!events?.length) return null;

  const isMulti = events.length > 1;

  return (
    <div className={styles["event-info"]}>
      <h2 className={styles["event-info__heading"]}>
        {isMulti ? "Афиша" : events[0].title}
      </h2>

      <div className={styles["event-info__list"]}>
        {events.map((event) => {
          const dateLabel = formatDate(event.startDate);
          return (
            <article key={event._id} className={styles["event-info__item"]}>
              {event.imageUrl && (
                <Image
                  src={event.imageUrl}
                  alt={event.title || ""}
                  width={800}
                  height={400}
                  className={styles["event-info__img"]}
                />
              )}

              {isMulti && event.title && (
                <h3 className={styles["event-info__item-title"]}>
                  {event.title}
                </h3>
              )}

              {dateLabel && (
                <p className={styles["event-info__date"]}>{dateLabel}</p>
              )}

              {event.body && (
                <div className={styles["event-info__body"]}>
                  <PortableText
                    value={event.body}
                    components={portableTextComponents}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
