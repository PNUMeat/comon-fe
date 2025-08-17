
-----

# PostEditor.tsx 에디터 사용 설명서 📝

## 간단한 소개

**PostEditor**는 저희 코몬(Comon) 프로젝트에서 사용하는 **Lexical 기반의 리치 텍스트 에디터**예요. 게시글을 쓸 때 필요한 기능들을 모아 하나의 컴포넌트로 만들었죠. 마크다운 문법이나 코드 하이라이팅은 물론, 이미지 드래그 앤 드롭 같은 편리한 기능들도 담겨있습니다.

-----

## 목차

- [핵심 개념](https://www.google.com/search?q=%23-%ED%95%B5%EC%8B%AC-%EA%B0%9C%EB%85%90)
- [전체적인 구조](https://www.google.com/search?q=%23-%EC%A0%84%EC%B2%B4%EC%A0%81%EC%9D%B8-%EA%B5%AC%EC%A1%B0)
- [주요 기능들](https://www.google.com/search?q=%23-%EC%A3%BC%EC%9A%94-%EA%B8%B0%EB%8A%A5%EB%93%A4)
- [어떻게 쓰나요?](https://www.google.com/search?q=%23-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%93%B0%EB%82%98%EC%9A%94)
- [플러그인 시스템](https://www.google.com/search?q=%23-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C)
- [입맛대로 바꾸기 (커스터마이징)](https://www.google.com/search?q=%23-%EC%9E%85%EB%A7%9B%EB%8C%80%EB%A1%9C-%EB%B0%94%EA%BE%B8%EA%B8%B0-%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%A7%88%EC%9D%B4%EC%A7%95)
- [API 레퍼런스](https://www.google.com/search?q=%23api-%EB%A0%88%ED%8D%BC%EB%9F%B0%EC%8A%A4)

-----

## 💡 핵심 개념

### Lexical 프레임워크

PostEditor는 Meta(구 Facebook)에서 만든 **Lexical**이라는 프레임워크를 기반으로 만들었어요. Lexical은 이런 특징들이 있어서 선택하게 됐습니다.

* **불변성(Immutability)**: 에디터의 상태(state)가 불변 객체로 관리되어서 안정적이에요.
* **플러그인 아키텍처**: 기능들을 독립된 플러그인으로 만들어 쉽게 붙였다 뗄 수 있어요.
* **타입 안전성**: TypeScript로 만들어져서 타입을 명확하게 관리할 수 있어요.
* **접근성**: 웹 접근성 표준(WAI-ARIA)을 잘 지켜서 만들어졌어요.

### 에디터의 기본 재료들

에디터를 시작할 때 필요한 기본 설정과 노드(Node)들이에요. 이미지, 링크, 제목, 코드 블록 등 에디터가 이해할 수 있는 콘텐츠의 종류를 미리 알려주는 거죠.

```typescript
// 에디터 초기 설정
const initialConfig = {
  namespace: 'comon',
  theme: editorTheme,
  nodes: [
    ImageNode,      // 이미지
    AutoLinkNode,   // 자동 링크
    LinkNode,       // 링크
    HeadingNode,    // 제목 (h1, h2...)
    QuoteNode,      // 인용문
    ListNode,       // 리스트 (ul)
    ListItemNode,   // 리스트 아이템 (li)
    CodeNode,       // 코드 블록
    CodeHighlightNode, // 코드 하이라이팅
  ],
  onError,
};
```

-----

## 🏗️ 전체적인 구조

### 컴포넌트 구조

PostEditor는 여러 컴포넌트가 조립된 형태로 되어있어요.

```
PostEditor
├── LexicalComposer           // 에디터의 핵심 로직을 관리해요.
├── PostSectionWrap           // 드래그 앤 드롭 기능을 담당하는 래퍼예요.
│   ├── TitleInput           // 제목을 입력하는 부분
│   ├── ToolbarPlugin       // 글자 스타일을 바꾸는 툴바
│   └── PostWriteSection    // 글을 실제로 작성하는 영역
│       ├── RichTextPlugin  // 기본적인 텍스트 기능을 제공해요.
│       ├── 여러 플러그인들...
│       └── ContentEditable // 편집 가능한 실제 DOM 영역
```

### 플러그인 구조

에디터의 주요 기능들은 대부분 플러그인으로 만들어져 있어요. 필요한 기능을 쉽게 추가하거나 뺄 수 있죠.

| 플러그인 이름 | 하는 일 | 파일 위치 |
| :--- | :--- | :--- |
| **ToolbarPlugin** | 텍스트 서식을 바꾸는 툴바 기능 | `plugins/ToolbarPlugin.tsx` |
| **ImagePlugin** | 이미지 추가하고 관리하는 기능 | `plugins/ImagePlugin.tsx` |
| **CodeActionPlugin** | 코드 블록 관련 기능들 | `plugins/CodeActionPlugin.tsx` |
| **FloatingLinkEditorPlugin** | 링크를 수정할 때 뜨는 작은 창 | `plugins/FloatingLinkEditorPlugin.tsx` |
| **DraggablePlugin** | 콘텐츠 블록을 끌어서 옮기는 기능 | `plugins/DraggablePlugin.tsx` |
| **GrabContentPlugin** | 작성된 콘텐츠를 가져오는 역할 | `plugins/GrabContentPlugin.tsx` |
| **HighlightCodePlugin** | 코드를 예쁘게 색칠해주는 기능 | `plugins/HighlightCodePlugin.ts` |
| **ClipboardPlugin** | 복사/붙여넣기 처리 | `plugins/ClipboardPlugin.ts` |
| **InitContentPlugin** | 처음 에디터에 보여줄 내용 설정 | `plugins/InitContentPlugin.tsx` |
| **MaxIndentPlugin** | 글머리 기호 들여쓰기 제한 | `plugins/MaxIndentPlugin.tsx` |

-----

## ✨ 주요 기능들

### 1\. 텍스트 꾸미기

글을 꾸밀 수 있는 다양한 서식 기능이 있어요.

* **굵게**: `Ctrl+B` 또는 `**텍스트**`
* *기울임*: `Ctrl+I` 또는 `*텍스트*`
* \~\~취소선\~\~: `~~텍스트~~`
* `인라인 코드`: `` `코드` ``
* 위첨자 및 아래첨자

### 2\. 마크다운 단축키

익숙한 마크다운 문법도 대부분 쓸 수 있어요.

````markdown
# 제목 1
## 제목 2
### 제목 3

- 순서 없는 목록
1. 순서 있는 목록

> 인용문

```javascript
// 코드 블록
console.log("Hello World");
````

````

### 3. 이미지 다루기

#### 이미지는 이렇게 올릴 수 있어요

1.  **드래그 앤 드롭**: 컴퓨터에 있는 이미지를 에디터로 끌어다 놓으세요.
2.  **붙여넣기**: 웹서핑하다 본 이미지를 복사해서 `Ctrl+V`로 붙여넣을 수 있어요.
3.  **툴바 버튼**: 툴바의 이미지 아이콘을 눌러 직접 파일을 선택할 수도 있습니다.

#### 이미지 업로드 과정

이미지가 올라가면 내부적으로는 이런 과정을 거쳐요.

```typescript
// 이미지 업로드 처리 과정
1. 이미지 파일이 맞는지 확인
2. 서버에 Presigned URL 요청 (S3에 올릴 권한 받기)
3. S3(저장소)에 이미지 업로드
4. 에디터 본문에 이미지 삽입
````

### 4\. 코드 하이라이팅

Prism.js를 활용해서 다양한 프로그래밍 언어의 코드를 예쁘게 보여줘요.

```typescript
// 테마에 정의된 하이라이팅 색상들
const editorTheme: EditorThemeClasses = {
  codeHighlight: {
    atrule: 'o',     // @-규칙
    attr: 'o',       // 속성
    boolean: 'p',    // 불리언
    comment: 'r',    // 주석
    function: 's',   // 함수
    keyword: 'o',    // 키워드
    number: 'p',     // 숫자
    operator: 't',   // 연산자
    string: 'q',     // 문자열
    variable: 'u',   // 변수
  },
};
```

-----

## 🚀 어떻게 쓰나요?

### 기본 사용법

`PostEditor` 컴포넌트를 불러와서 필요한 props만 넘겨주면 바로 쓸 수 있어요.

```typescript
import PostEditor from '@/components/features/Post/PostEditor';

function MyComponent() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <PostEditor
      imageCategory="posts"
      forwardTitle={setTitle}
      forwardContent={setContent}
      title={title}
      content={content}
    />
  );
}
```

### Props 살펴보기

| Prop | 타입 | 필수 | 설명 |
| :--- | :--- | :--- | :--- |
| `imageCategory` | `string` | ✅ | S3에 이미지를 올릴 때 사용할 카테고리예요. (e.g., 'posts', 'profile') |
| `forwardTitle` | `(title: string) => void` | ❌ | 제목이 바뀔 때마다 부모 컴포넌트로 값을 보내줘요. |
| `forwardContent` | `(content: string) => void` | ❌ | 내용이 바뀔 때마다 부모 컴포넌트로 값을 보내줘요. |
| `content` | `string` | ❌ | 에디터에 처음 보여줄 초기 콘텐츠 내용이에요. |
| `title` | `string` | ❌ | 에디터에 처음 보여줄 초기 제목이에요. |
| `tag` | `string` | ❌ | 선택된 게시글 태그 |
| `setTag` | `(tag: string) => void` | ❌ | 태그를 변경할 때 사용하는 함수 |

### 고급 활용법

#### 1\. 이미지 처리 로직 직접 만들기

기본 이미지 업로드 로직 대신, 직접 만든 함수를 사용하고 싶을 때가 있죠. 예를 들어, 이미지를 압축해서 올리고 싶을 때 활용할 수 있어요.

```typescript
// 이미지 업로드 과정을 직접 만들어봅시다.
const customImageHandler = async (file: File) => {
  // 1. 이미지 파일인지 확인
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 올릴 수 있어요!');
  }

  // 2. 이미지 압축 (선택 사항)
  const compressedFile = await compressImage(file);

  // 3. S3에 업로드
  const uploadResult = await uploadToS3(compressedFile);

  // 4. 에디터에 삽입할 이미지 정보 반환
  const imgPayload: InsertImagePayload = {
    altText: '업로드된 이미지',
    maxWidth: 600,
    src: uploadResult.url,
  };
  
  return imgPayload;
};
```

#### 2\. 작성된 콘텐츠 가져오기

작성된 글을 HTML이나 텍스트로 가져와서 저장하거나 다른 곳에 활용할 수 있어요.

```typescript
// 에디터 내용을 HTML로 가져오기
const extractHTMLContent = (editor: LexicalEditor): string => {
  let htmlContent = '';
  
  editor.update(() => {
    const root = $getRoot();
    // 실제로는 $generateHtmlFromNodes(editor, selection) 같은 함수를 사용해요.
    // 이 코드는 예시를 위해 단순화했습니다.
    htmlContent = root.getTextContent(); 
  });
  
  return htmlContent;
};
```

-----

## 🧩 플러그인 시스템

### 나만의 플러그인 만들기

새로운 기능을 추가하고 싶다면, 직접 플러그인을 만들어보세요. 아래 구조를 따르면 쉽게 만들 수 있어요.

```typescript
// 예시: CustomPlugin.tsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export function CustomPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // 플러그인이 처음 로드될 때 실행할 로직
    const cleanup = editor.registerCommand(
      CUSTOM_COMMAND,
      (payload) => {
        // 커맨드가 실행됐을 때 처리할 로직
        return true; // 이벤트가 처리됐다고 알려줌
      },
      COMMAND_PRIORITY_LOW // 커맨드 처리 우선순위
    );

    // 컴포넌트가 사라질 때 정리
    return cleanup;
  }, [editor]);

  return null; // 별도의 UI가 없는 플러그인은 null을 반환
}
```

### 주요 플러그인 톺아보기

#### ToolbarPlugin

글씨체를 바꾸거나 링크를 다는 등 텍스트 서식을 담당하는 툴바예요.

* **주요 기능**: 굵게, 기울임, 취소선, 폰트 종류/크기 변경, 링크/이미지 추가, 태그 선택 등
* **사용법**:

<!-- end list -->

```typescript
<ToolbarPlugin
  setIsLinkEditMode={setIsLinkEditMode}
  setTag={setTag}
  articleCategory={tag}
  imageCategory={imageCategory}
/>
```

#### ImagePlugin

에디터의 모든 이미지 처리를 담당해요.

* **주요 기능**: 이미지 추가 커맨드 처리, 이미지 크기 조절, 정렬 등

#### DraggablePlugin

콘텐츠 블록(문단, 이미지 등)을 마우스로 끌어서 순서를 바꿀 수 있게 해줘요.

* **주요 기능**: 블록 옆에 드래그 핸들 표시, 드래그해서 순서 바꾸기, 어디에 놓을지 시각적으로 표시

-----

## 🎨 입맛대로 바꾸기 (커스터마이징)

### 테마 수정하기

에디터의 색상이나 폰트 스타일을 바꾸고 싶다면 `editorTheme` 객체를 수정하면 돼요.

```typescript
const customTheme: EditorThemeClasses = {
  ...editorTheme, // 기존 테마를 복사하고
  text: {
    ...editorTheme.text,
    bold: 'my-custom-bold-class', // 굵게 스타일에 적용할 CSS 클래스 이름 변경
    italic: 'my-custom-italic-class',
  },
  // 다른 스타일도 자유롭게 바꿀 수 있어요.
};
```

### CSS 직접 수정하기

더 세밀한 디자인 변경이 필요하면 `editor.css` 파일을 직접 수정하세요.

```css
/* 에디터 기본 스타일 */
.content-editable {
  outline: none;
  font-family: Pretendard, serif;
  line-height: 1.5;
  padding: 20px 50px;
}

/* 나만의 스타일 추가하기 */
.my-custom-bold-class {
  font-weight: 900;
  color: #ff6b6b; /* 굵은 글씨를 더 굵고 빨갛게! */
}
```

### 반응형 디자인

에디터는 모바일 화면도 고려해서 만들어졌어요. `max-width` 미디어 쿼리를 사용해서 모바일 스타일을 조정할 수 있습니다.

```css
@media (max-width: 768px) {
  .content-editable {
    padding: 20px 20px; /* 모바일에선 여백을 줄여요 */
  }
  
  .editor-dropdown-items {
    font-size: 12px; /* 드롭다운 폰트 크기 조정 */
  }
}
```

-----

## 📚 API 레퍼런스

### 주요 Commands

에디터의 특정 동작을 실행시키는 명령어들이에요.

| 커맨드 | 설명 | 페이로드 타입 |
| :--- | :--- | :--- |
| `INSERT_IMAGE_COMMAND` | 에디터에 이미지를 넣어요. | `InsertImagePayload` |
| `TOGGLE_LINK_COMMAND` | 선택된 텍스트에 링크를 걸거나 해제해요. | `string \| null` |
| `FORMAT_TEXT_COMMAND` | 텍스트 서식을 적용해요 (굵게, 기울임 등). | `TextFormatType` |

### 타입 정의

`PostEditor`에서 사용하는 주요 타입들이에요.

```typescript
// 이미지 삽입 시 필요한 정보
interface InsertImagePayload {
  altText: string;
  maxWidth: number;
  src: string;
}

// PostEditor 컴포넌트가 받는 Props
interface PostEditorProps {
  imageCategory: string;
  forwardTitle?: (title: string) => void;
  forwardContent?: (content: string) => void;
  content?: string;
  title?: string;
  tag?: string;
  setTag?: (tag: string) => void;
}
```

### 이벤트 핸들러

복사/붙여넣기나 드래그 앤 드롭 같은 브라우저 이벤트를 직접 처리할 수도 있어요.

```typescript
// 붙여넣기 이벤트 처리
const onPaste = useCallback((e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  // 여기서 이미지나 텍스트를 가공해서 붙여넣을 수 있어요.
}, [editor]);

// 드래그 앤 드롭 이벤트 처리
const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  // 끌어다 놓은 파일들을 처리하는 로직을 넣을 수 있어요.
}, []);
```

-----

## ⚡️ 성능 최적화

### 1\. 리렌더링 방지 (Memoization)

`React.memo`를 사용해서 props가 바뀌지 않으면 에디터가 불필요하게 다시 렌더링되지 않도록 막았어요.

```typescript
export default memo(PostEditor);
```

### 2\. 코드 분할 (Code Splitting)

무거운 플러그인은 `React.lazy`를 사용해서 필요할 때만 불러오도록 처리하여 초기 로딩 속도를 높였어요.

```typescript
const LazyPlugin = lazy(() => import('./plugins/LazyPlugin'));
```

### 3\. 이미지 최적화

* 업로드 시 자동으로 이미지를 압축해요.
* WebP 포맷을 사용해서 이미지 용량을 줄였어요.
* 화면에 보일 때만 이미지를 로드하는 레이지 로딩을 적용했어요.

-----

## 🛠️ 트러블슈팅

### 이럴 땐 이렇게 해보세요

#### 1\. 이미지가 안 올라가요.

* **원인**: S3 권한 문제, Presigned URL 만료, 파일 크기 제한
* **해결책**:
    * S3 버킷의 권한 설정(CORS 등)이 올바른지 확인해보세요.
    * 서버에서 생성해주는 Presigned URL의 만료 시간이 너무 짧지 않은지 확인해보세요.
    * 업로드하려는 이미지 파일 크기가 서버에서 정한 제한을 넘지 않는지 확인해보세요.

#### 2\. 마크다운 단축키가 안 먹혀요.

* **원인**: 플러그인 등록 누락
* **해결책**:
    * `MarkdownShortcutPlugin`이 에디터 플러그인 목록에 제대로 추가되어 있는지 확인해주세요.
    * 원하는 단축키가 플러그인 설정에 포함되어 있는지 확인해보세요.

#### 3\. 모바일에서 화면이 깨져요.

* **원인**: 반응형 스타일링 미비
* **해결책**:
    * CSS 파일에 모바일 화면을 위한 미디어 쿼리(`@media (max-width: ...)`)가 잘 적용됐는지 확인해보세요.
    * HTML의 `meta` 태그에 뷰포트 설정이 제대로 되어있는지 확인해주세요.

-----

## 💻 개발 환경 설정

### 필요한 라이브러리 설치

```bash
npm install @lexical/react @lexical/code @lexical/link @lexical/list
npm install @lexical/selection @lexical/utils
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드하기

```bash
npm run build
```

-----

## 🙌 기여하고 싶으신가요? (Contribution Guide)

PostEditor를 더 좋게 만드는 데 기여하고 싶으신가요? 환영합니다\!

1.  GitHub 이슈를 확인하거나 새로운 이슈를 만들어주세요.
2.  기능 개발을 위한 브랜치를 새로 만드세요 (`feature/기능이름`).
3.  코드를 작성하고 테스트를 추가해주세요.
4.  Pull Request(PR)를 보내주시면 검토 후 반영하겠습니다.

### 코드 스타일

* **TypeScript**를 사용해요.
* **ESLint**와 **Prettier**로 코드 스타일을 통일해요.
* 컴포넌트는 `React.FC` 타입을 사용해주세요.
* 스타일은 \*\*Emotion (CSS-in-JS)\*\*을 사용하고 있어요.

-----

이 문서는 PostEditor.tsx를 이해하고 사용하는 데 필요한 기본적인 내용을 담고 있어요. 더 궁금한 점이나 새로운 기능 아이디어가 있다면 언제든지 이슈로 알려주세요!