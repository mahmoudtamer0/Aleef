"use client";

import { useState } from "react";
import { BookingSuccess } from "@/components/BookingSuccess/BookingSuccess";
import { BookingSummary } from "@/components/BookingSummary/BookingSummary";
import { DayPicker } from "@/components/DayPicker/DayPicker";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { PetPicker } from "@/components/PetPicker/PetPicker";
import { Step } from "@/components/Step/Step";
import { TimeSlots } from "@/components/TimeSlots/TimeSlots";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useDoctorSlots } from "@/hooks/useDoctor";
import { usePets } from "@/hooks/usePets";
import { appointmentReasons } from "@/lib/appointmentReasons";
import { getErrorMessage } from "@/lib/api/client";
import { formatFullDate, formatSlot } from "@/lib/date";
import { cx } from "@/lib/utils";
import type { DoctorSchedule } from "@/types";
import styles from "./BookingForm.module.css";

// The whole booking flow. It keeps what the user chose, and the small components below only show it.
export function BookingForm({ doctorId, schedule }: { doctorId: string; schedule: DoctorSchedule }) {
  const { doctor, days, firstDaySlots } = schedule;

  // what the user chose
  const [petId, setPetId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(days[0] ?? null); // the first day is picked for them
  const [time, setTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState<{ petName: string; dateLabel: string; timeLabel: string } | null>(null);

  const { data: pets = [] } = usePets();
  const slots = useDoctorSlots(doctorId, date, days[0] ? { date: days[0], slots: firstDaySlots } : undefined);
  const booking = useCreateAppointment();

  // a user with one pet doesn't have to pick it
  const activePetId = petId ?? (pets.length === 1 ? pets[0].id : null);
  const pet = pets.find((p) => p.id === activePetId);
  // forget the time if a refresh shows it was taken
  const activeTime = time && slots.data?.includes(time) ? time : null;
  const canSubmit = !!activePetId && !!date && !!activeTime && !!reason;

  function submit() {
    if (!canSubmit) return;
    booking.mutate(
      { doctor: doctorId, pet: activePetId, date, time: activeTime, reason, notes: notes.trim() || undefined },
      {
        onSuccess: () => setBooked({ petName: pet?.name ?? "Your pet", dateLabel: formatFullDate(date), timeLabel: formatSlot(activeTime) }),
        onError: () => slots.refetch(),
      },
    );
  }

  if (booked) return <BookingSuccess doctorName={doctor.name} {...booked} />;
  if (days.length === 0) return <EmptyState message="This doctor has no available days right now." />;

  return (
    <div className={`rise ${styles.layout}`} style={{ animationDelay: "200ms" }}>
      <div className={styles.steps}>
        <Step number={1} title="Choose your pet">
          <PetPicker selectedId={activePetId} onSelect={setPetId} />
        </Step>

        <Step number={2} title="Pick a day and time" hint="Only the doctor's free times are shown.">
          <DayPicker days={days} selected={date} onSelect={(d) => { setDate(d); setTime(null); }} />
          <label className={styles.label}>Available times</label>
          <TimeSlots
            slots={slots.data}
            isLoading={slots.isPending}
            isError={slots.isError}
            onRetry={() => slots.refetch()}
            selected={activeTime}
            onSelect={setTime}
          />
        </Step>

        <Step number={3} title="Why are you visiting?">
          <div role="radiogroup" aria-label="Reason for the visit" className={styles.chips}>
            {appointmentReasons.map((r) => (
              <button key={r} type="button" role="radio" aria-checked={r === reason} onClick={() => setReason(r)} className={cx(styles.chip, r === reason && styles.chipOn)}>
                {r}
              </button>
            ))}
          </div>
          <label htmlFor="notes" className={styles.label}>Notes for the doctor (optional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder="Symptoms, medicines, anything the doctor should know…" className={styles.textarea} />
          <p className={styles.hint}>{notes.length}/500</p>
        </Step>
      </div>

      <div className={styles.aside}>
        <BookingSummary
          doctorName={doctor.name}
          fee={doctor.fee}
          petName={pet?.name}
          dateLabel={date ? formatFullDate(date) : undefined}
          timeLabel={activeTime ? formatSlot(activeTime) : undefined}
          reason={reason || undefined}
          canSubmit={canSubmit}
          busy={booking.isPending}
          error={booking.isError ? getErrorMessage(booking.error) : undefined}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}
