'use client';

import { useLayoutEffect, useRef, type MouseEvent } from 'react';
import { animate, useMotionValue, type PanInfo } from 'framer-motion';
import { CalendarGrid, CalendarMonthButton } from '@/components/calendar/Calendar';
import {
  shiftYearMonth,
  toYearMonthKey,
  type CalendarDayInfo,
  type YearMonth,
} from '@/utils/calendar';
import * as S from './CalendarSwiper.styles';

/** 화면 너비 대비 이 비율 이상 밀면 옆 달로 넘어감 */
const SWIPE_DISTANCE_RATIO = 0.25;
/** 이 속도(px/s) 이상으로 튕기면 거리가 짧아도 옆 달로 넘어감 */
const SWIPE_VELOCITY = 500;
const SLIDE_TRANSITION = { type: 'tween', ease: 'easeOut', duration: 0.25 } as const;

/** 이전 / 현재 / 다음 달 */
const PANEL_OFFSETS = [-1, 0, 1] as const;

interface CalendarSwiperProps {
  /** 현재 보고 있는 연/월 */
  yearMonth: YearMonth;
  /** 오늘 날짜 (YYYY-MM-DD) */
  todayKey: string;
  /** 연월 키(yyyy-MM)별 날짜 칸 정보. 이전/현재/다음 달을 넘겨야 스와이프 중에도 옆 달이 채워져 보인다. */
  daysByMonth: Record<string, Record<string, CalendarDayInfo>>;
  /** 스와이프로 옆 달로 넘어갔을 때 */
  onChangeMonth: (yearMonth: YearMonth) => void;
  /** 연/월 영역 클릭 */
  onClickMonth?: () => void;
  /** 날짜 클릭 */
  onClickDate?: (dateKey: string) => void;
}

/** 연/월 버튼은 고정하고, 요일 + 날짜 격자를 좌우로 끌어 이전/다음 달로 이동하는 캘린더 */
const CalendarSwiper = ({
  yearMonth,
  todayKey,
  daysByMonth,
  onChangeMonth,
  onClickMonth,
  onClickDate,
}: CalendarSwiperProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const x = useMotionValue(0);

  // 달이 바뀌어 세 패널이 다시 그려진 직후 트랙을 가운데로 되돌린다.
  // 화면에 그려지기 전에 처리해야 이전 위치가 한 프레임 보이는 깜빡임이 없다.
  useLayoutEffect(() => {
    x.set(0);
  }, [yearMonth, x]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    // 드래그를 끝낸 손가락이 떼어지며 발생하는 click은 무시하고, 그다음 클릭부터 받는다.
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);

    const width = viewportRef.current?.offsetWidth ?? 0;
    const threshold = width * SWIPE_DISTANCE_RATIO;
    const { offset, velocity } = info;

    let direction = 0;
    if (offset.x < -threshold || velocity.x < -SWIPE_VELOCITY) direction = 1;
    else if (offset.x > threshold || velocity.x > SWIPE_VELOCITY) direction = -1;

    if (direction === 0 || width === 0) {
      animate(x, 0, SLIDE_TRANSITION);
      return;
    }

    animate(x, -direction * width, {
      ...SLIDE_TRANSITION,
      onComplete: () => onChangeMonth(shiftYearMonth(yearMonth, direction)),
    });
  };

  const handleClickCapture = (event: MouseEvent) => {
    if (!isDraggingRef.current) return;
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <S.Container>
      <CalendarMonthButton yearMonth={yearMonth} onClick={onClickMonth} />
      <S.Viewport ref={viewportRef}>
        <S.Track
          style={{ x }}
          drag="x"
          dragDirectionLock
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClickCapture={handleClickCapture}
        >
          {PANEL_OFFSETS.map((offset) => {
            const panelYearMonth = shiftYearMonth(yearMonth, offset);
            const key = toYearMonthKey(panelYearMonth);
            const isCurrent = offset === 0;
            return (
              <S.Panel key={key} aria-hidden={!isCurrent || undefined}>
                <CalendarGrid
                  yearMonth={panelYearMonth}
                  todayKey={todayKey}
                  days={daysByMonth[key] ?? {}}
                  onClickDate={isCurrent ? onClickDate : undefined}
                />
              </S.Panel>
            );
          })}
        </S.Track>
      </S.Viewport>
    </S.Container>
  );
};

export default CalendarSwiper;
