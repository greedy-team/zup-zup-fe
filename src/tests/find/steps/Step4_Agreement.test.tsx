import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Step4_Agreement from '../../../component/find/steps/Step4_Agreement';
import { PLEDGE_TEXT } from '../../../constants/find';

describe('Step4_Agreement 컴포넌트 테스트', () => {
  it('서약 관련 텍스트와 입력창이 올바르게 렌더링되어야 한다', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Step4_Agreement agreementRef={ref} />);

    expect(screen.getByText('✨ Zupzup 성실 이용 서약 ✨')).toBeInTheDocument();
    expect(screen.getByText(PLEDGE_TEXT)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('상단 문구를 똑같이 입력해주세요.')).toBeInTheDocument();
  });

  it('agreementRef가 input 요소에 올바르게 연결되어야 한다', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Step4_Agreement agreementRef={ref} />);

    const inputElement = screen.getByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    expect(ref.current).toBe(inputElement);
  });

  it('입력창에 붙여넣기 시도 시 alert가 호출되고, 붙여넣기가 방지되어야 한다', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLInputElement>();
    render(<Step4_Agreement agreementRef={ref} />);

    // window.alert를 모의(mock) 처리
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const inputElement = screen.getByPlaceholderText('상단 문구를 똑같이 입력해주세요.');
    inputElement.focus();

    const textToPaste = '붙여넣기 테스트';
    await user.paste(textToPaste);

    expect(alertSpy).toHaveBeenCalledWith('붙여넣기는 사용할 수 없습니다.');
    expect(inputElement).toHaveValue('');

    alertSpy.mockRestore();
  });
});
