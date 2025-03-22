import { CSSObject} from '@emotion/react';
import styled from '@emotion/styled';

const ShortInput = styled.input<{ customStyle?: CSSObject}>`
  display: flex;
  padding: 10px 19px;
  height: 20px;
  width: 146px;
  align-items: center;

  border: 1px solid #cdcfff;
  border-radius: 20px;
  background: #fff;

  font-size: 16px;
  color: #777777;

  &:focus {
    outline: none;
    border-color: #a3bffa;
  }

  &::placeholder {
    color: #cccccc;
  }

  ${(props) => props.customStyle}
`;

/**
 * 상태가 매핑되지 않은 컴포넌트이므로 상태를 매핑해서 사용해야함
 */
export const ComonShortInput: React.FC<{
  type: string;
  placeholder: string;
  value: string | number;
  css?: CSSObject;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ type, placeholder, value, css: customStyle, onChange }) => {
  return (
    <ShortInput
      type={type}
      placeholder={placeholder}
      value={value}
      customStyle={customStyle}
      onChange={onChange}
    />
  );
};
