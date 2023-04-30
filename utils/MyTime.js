import { Time } from "fca-dunnn";

class MyTime extends Time {
    static getUptime() {
        const time = process.uptime();
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor((time % 3600) % 60);
        return {
            hours,
            minutes,
            seconds,
            toString() {
                return `${hours} giờ ${minutes} phút ${seconds} giây`;
            }
        }
    }

    static getDay() {
        const date = MyTime.now()
        return date.day()
    }
}

export default MyTime;