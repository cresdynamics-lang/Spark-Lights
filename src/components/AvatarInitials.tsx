interface AvatarInitialsProps {
  name: string;
  className?: string;
}

export default function AvatarInitials({ name, className = '' }: AvatarInitialsProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <span
      className={`inline-flex items-center justify-center bg-primary-black text-primary-gold font-black uppercase ${className}`}
      aria-hidden
    >
      {initials || '?'}
    </span>
  );
}
