import { Button } from "@/components/ui/button";

export default function GoogleLogin() {
  return (
    <div className="w-[320px]">
      <Button
        variant="outline"
        className="w-full text-sm font-light text-secondary"
      >
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.94813 7.99999C3.94813 7.48037 4.03438 6.98212 4.1885 6.51487L1.49225 4.45599C0.966754 5.52287 0.670753 6.72512 0.670753 7.99999C0.670753 9.27387 0.966503 10.4752 1.49113 11.5415L4.18588 9.47862C4.03325 9.01349 3.94813 8.51712 3.94813 7.99999Z"
            fill="#FBBC05"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.68212 3.27275C9.811 3.27275 10.8306 3.67275 11.6317 4.32725L13.9622 2C12.5421 0.763625 10.7214 0 8.68212 0C5.51612 0 2.79512 1.8105 1.49225 4.456L4.18837 6.51487C4.80962 4.62912 6.5805 3.27275 8.68212 3.27275Z"
            fill="#EA4335"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.68212 12.7272C6.58062 12.7272 4.80975 11.3709 4.1885 9.48512L1.49225 11.5436C2.79512 14.1895 5.51612 16 8.68212 16C10.6361 16 12.5017 15.3061 13.9019 14.0061L11.3426 12.0276C10.6205 12.4825 9.71112 12.7272 8.68212 12.7272Z"
            fill="#34A853"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.3293 8C16.3293 7.52725 16.2564 7.01813 16.1471 6.5455H8.68213V9.63638H12.9791C12.7643 10.6903 12.1795 11.5004 11.3426 12.0276L13.9019 14.0061C15.3726 12.6411 16.3293 10.6076 16.3293 8Z"
            fill="#4285F4"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  );
}
