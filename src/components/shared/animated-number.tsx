"use client";

import CountUp from "react-countup";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
  decimals = 0,
}: AnimatedNumberProps) {
  return (
    <CountUp
      end={value}
      duration={duration}
      separator=","
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
      preserveValue
    />
  );
}