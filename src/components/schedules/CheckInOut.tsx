import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, XCircle, Clock } from "lucide-react";
import { scheduleApi } from "@/services/scheduleApi";
import { Schedule } from "@/types";

interface CheckInOutProps {
  schedule: Schedule;
  onStatusChange: () => void;
}

export function CheckInOut({ schedule, onStatusChange }: CheckInOutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setError("");
      await scheduleApi.checkIn(schedule._id);
      onStatusChange();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể check-in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      setError("");
      await scheduleApi.checkOut(schedule._id);
      onStatusChange();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể check-out');
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    switch (schedule.status) {
      case 'scheduled':
        return {
          icon: <Play className="h-4 w-4" />,
          text: 'Check-in',
          action: handleCheckIn,
          variant: 'default' as const,
          disabled: false
        };
      case 'in_progress':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Check-out',
          action: handleCheckOut,
          variant: 'default' as const,
          disabled: false
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Hoàn thành',
          action: () => {},
          variant: 'secondary' as const,
          disabled: true
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: 'Đã hủy',
          action: () => {},
          variant: 'destructive' as const,
          disabled: true
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          text: 'Chờ xử lý',
          action: () => {},
          variant: 'outline' as const,
          disabled: true
        };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div className="flex flex-col items-end space-y-2">
      <Button
        onClick={buttonContent.action}
        variant={buttonContent.variant}
        disabled={buttonContent.disabled || loading}
        className="min-w-[120px]"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Đang xử lý...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {buttonContent.icon}
            <span>{buttonContent.text}</span>
          </div>
        )}
      </Button>
      
      {error && (
        <p className="text-xs text-red-600 text-right max-w-[120px]">
          {error}
        </p>
      )}
    </div>
  );
}
