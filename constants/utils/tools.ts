export const maskEmail = (email: string) => {
    if (typeof email !== 'string') return '';
    const [name, domain] = email.split("@");
    return `${name.charAt(0)}***${name.charAt(name.length - 1)}@${domain}`;
  };
  
  export const maskPhone = (phone: string) => {
    if (typeof phone !== 'string') return '';
    return `${phone.slice(0, 3)} *** *** ${phone.slice(-2)}`;
  };

  export const formatTimeWithPeriod = (time: string) => {
    if (typeof time !== 'string') return '';
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  export const formatDate = (dateString: string) => {
    if (typeof dateString !== 'string') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };