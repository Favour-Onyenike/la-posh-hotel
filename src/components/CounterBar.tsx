
import React, { useState, useEffect, useRef } from "react";
import { Star, BedDouble, Users, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

type CounterItemProps = {
  icon: React.ElementType;
  targetValue: number;
  suffix?: string;
  label: string;
  duration?: number;
};

const CounterItem = ({ 
  icon: Icon, 
  targetValue, 
  suffix = "", 
  label,
  duration = 2000 
}: CounterItemProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const countStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !countStarted.current) {
          countStarted.current = true;
          
          const startTime = Date.now();
          const endTime = startTime + duration;
          
          const updateCounter = () => {
            const now = Date.now();
            const progress = Math.min(1, (now - startTime) / duration);
            const currentCount = Math.floor(progress * targetValue);
            
            setCount(currentCount);
            
            if (now < endTime) {
              requestAnimationFrame(updateCounter);
            } else {
              setCount(targetValue);
            }
          };
          
          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [targetValue, duration]);

  return (
    <div className="flex flex-col items-center" ref={counterRef}>
      <div className="bg-hotel-gold p-4 rounded-full mb-4">
        <Icon className="text-white" size={24} />
      </div>
      <div className="text-4xl font-bold mb-2">
        {count}{suffix}
      </div>
      <p className="text-center text-black">{label}</p>
    </div>
  );
};

const CounterBar = () => {
  return (
    <section className="section-padding bg-white">
      <div className="hotel-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CounterItem 
            icon={Percent}
            targetValue={99}
            suffix="%"
            label="Customer Satisfaction"
          />
          <CounterItem 
            icon={BedDouble}
            targetValue={4}
            label="Premium Suites"
          />
          <CounterItem 
            icon={BedDouble}
            targetValue={9}
            label="Standard Rooms"
          />
          <CounterItem 
            icon={Users}
            targetValue={100}
            suffix="+"
            label="Happy Customers"
          />
        </div>
      </div>
    </section>
  );
};

export default CounterBar;
