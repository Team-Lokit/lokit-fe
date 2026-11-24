import { useState } from 'react';
import Modal from '@/components/popup/modal/Modal';
import TextButton from '@/components/buttons/textButton/TextButton';
import { CALENDAR_MAX_YEAR, CALENDAR_MIN_YEAR, type YearMonth } from '@/utils/calendar';
import * as S from './MonthPickerModal.styles';
import { createNumericChangeHandler } from '@/utils/numericInput';

const MAX_YEAR_LENGTH = String(CALENDAR_MAX_YEAR).length;

interface MonthPickerModalProps {
  isOpen: boolean;
  /** 모달을 열 때 입력칸에 채울 연/월 (현재 캘린더에서 보고 있는 달) */
  initialYearMonth: YearMonth;
  onClose: () => void;
  /** 변경하기 클릭 시 입력한 연/월 전달 */
  onConfirm: (yearMonth: YearMonth) => void;
}

/** 캘린더 연/월 이동용 숫자 키패드 입력 모달 */
const MonthPickerModal = ({
  isOpen,
  initialYearMonth,
  onClose,
  onConfirm,
}: MonthPickerModalProps) => {
  const [year, setYear] = useState(String(initialYearMonth.year));
  const [month, setMonth] = useState(String(initialYearMonth.month));

  // 모달이 열릴 때마다 현재 보고 있는 연/월로 입력값 초기화 (렌더 중 상태 조정 패턴)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setYear(String(initialYearMonth.year));
      setMonth(String(initialYearMonth.month));
    }
  }

  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const isValid =
    year.length > 0 &&
    yearNumber >= CALENDAR_MIN_YEAR &&
    yearNumber <= CALENDAR_MAX_YEAR &&
    monthNumber >= 1 &&
    monthNumber <= 12;

  // 현재 보고 있는 달과 같으면 이동할 필요가 없으므로 변경하기 비활성
  const isChanged =
    yearNumber !== initialYearMonth.year || monthNumber !== initialYearMonth.month;
  const canConfirm = isValid && isChanged;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm({ year: yearNumber, month: monthNumber });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content>
        <S.InputRow>
          <S.InputBlock>
            <S.Input
              type="text"
              inputMode="numeric"
              placeholder="연도"
              aria-label="연도"
              value={year}
              $charCount={year.length || 4}
              onChange={createNumericChangeHandler(
                setYear,
                MAX_YEAR_LENGTH,
                CALENDAR_MAX_YEAR,
              )}
            />
            {year && <S.Suffix>년</S.Suffix>}
          </S.InputBlock>
          <S.InputBlock>
            <S.Input
              type="text"
              inputMode="numeric"
              placeholder="월"
              aria-label="월"
              value={month}
              $charCount={month.length || 2}
              onChange={createNumericChangeHandler(setMonth, 2, 12)}
            />
            {month && <S.Suffix>월</S.Suffix>}
          </S.InputBlock>
        </S.InputRow>
        <Modal.Footer>
          <TextButton text="닫기" onClick={onClose} style={{ flex: 1 }} />
          <TextButton
            text="변경하기"
            variant="primary"
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{ flex: 1 }}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default MonthPickerModal;
