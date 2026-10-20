"use client";

import { useState } from "react";
import { Button } from "@/components/Button/Button";
import { CancelAppointmentModal } from "@/components/CancelAppointmentModal/CancelAppointmentModal";
import { useCancelAppointment } from "@/hooks/useAppointments";
import { getErrorMessage } from "@/lib/api/client";

// "Cancel appointment" button + its popup. Once it works, the details page reloads and shows "Cancelled".
export function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
  const [open, setOpen] = useState(false);
  const cancel = useCancelAppointment();

  return (
    <>
      <Button
        variant="danger"
        onClick={() => {
          cancel.reset(); // forget an old error
          setOpen(true);
        }}
      >
        Cancel appointment
      </Button>
      <CancelAppointmentModal
        open={open}
        busy={cancel.isPending}
        error={cancel.isError ? getErrorMessage(cancel.error) : undefined}
        onClose={() => setOpen(false)}
        onConfirm={(reason) => cancel.mutate({ appointmentId, reason }, { onSuccess: () => setOpen(false) })}
      />
    </>
  );
}
