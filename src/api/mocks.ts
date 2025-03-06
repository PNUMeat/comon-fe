export const teamInfoMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    myTeamResponse: {
      teamId: 16,
      teamName: 'aa',
      teamExplain: '11',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      topic: '스터디',
      memberLimit: 12,
      memberCount: 1,
      streakDays: 0,
      teamAnnouncement: '',
      createdAt: '2024-12-26',
      members: [
        {
          memberName: '파댕이',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
          memberExplain: '생선 좋아하는 강아지',
          uuid: '358e0577-696f-418a-a0fc-80d63dbfe587',
        },
        {
          memberName: '주댕이',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
          memberExplain: '당근 많이 먹어서 주황색 된 강아지',
          uuid: 'aec0d712-8382-456e-8331-58d705900d98',
        },
      ],
    },
    teamManager: true,
    subjectArticleDateAndTagResponses: [
      {
        subjectDate: '2025-01-02',
        articleCategory: '스터디 예습',
      },
      {
        subjectDate: '2025-01-13',
        articleCategory: '스터디 복습',
      },
    ],
  },
};

export const membersInfoMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    memberName: '하내안',
    memberImageUrl:
      'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
    teamAbstractResponses: [
      {
        teamId: 16,
        teamName: 'aa',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 15,
        teamName: 'scroll',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 14,
        teamName: 'asd',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 13,
        teamName: 'asd',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 10,
        teamName: 'Team QA',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 3,
        teamName: '파댕이 밥주기',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/bae6cb5b-2772-41a7-b56f-808766d0dc50',
      },
      {
        teamId: 2,
        teamName: '장진영팀',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
      {
        teamId: 1,
        teamName: '제목제목제목제목제목',
        teamImageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      },
    ],
  },
};

export const teamArticlesMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    content: [
      {
        articleId: 453,
        articleTitle: '사진 테스트',
        articleBody: '<p><img src="?" alt="이미지"></p>',
        createdDate: '2025-02-11 18:14:07',
        imageUrl:
          'https://d1onwxr2n696de.cloudfront.net/article/00cd8b80-6698-436d-8041-fe539310efb9.png',
        memberName: '파댕이',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/5d22085d-ae52-451d-8fc6-8154ff9e08b2',
        isAuthor: false,
      },
      {
        articleId: 482,
        articleTitle: '2/11 class3 - 백준 1927번 : 최소힙',
        articleBody:
          '<p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">문제 유형</span></p><p dir="ltr" style="text-align: start;"><span style="">자료 구조 </span></p><p dir="ltr" style="text-align: start;"><span style="">우선순위 큐 </span></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">풀이 방법 도출 과정</span></p><p dir="ltr" style="text-align: start;"><span style="">우선순위 큐를 활용하면 쉽게 풀 수 있는 문제이다. </span></p><p dir="ltr" style="text-align: start;"><span style="">우선순위 큐에 offer 하면 오름차순으로 자동으로 정렬해준다. </span></p><p dir="ltr" style="text-align: start;"><span style="">0이 나오면 큐 poll() 해주고, 그렇지 않으면 offer 해주면 된다. </span></p><p dir="ltr" style="text-align: start;"><span style="">배열로 직접 힙 구현하려니깐 삭제 구현이 너무 복잡했다 ㅠㅜㅠ</span></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">시간 복잡도</span></p><p dir="ltr" style="text-align: start;"><span style="">자바는 heap 기반의 우선순위 큐를 사용하기 때문에 삽입 및 추출에 O(log N)의 시간복잡도가 걸린다. </span></p><p dir="ltr" style="text-align: start;"><span style="">따라서 전체 시간 복잡도는 O(NlogN)이라고 볼 수 있다. </span></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">문제 풀이 핵심 코드 이미지 삽입 및 간단 설명</span></p><pre class="codeblock" spellcheck="false" data-gutter="1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14"><span>&nbsp;</span><span style="white-space: pre-wrap;">\t</span><span style="white-space: pre-wrap;">\t</span><span style="white-space: pre-wrap;">\t</span><span style="white-space: pre-wrap;">\t</span><span>int n </span><span class="t">=</span><span> Integer</span><span class="v">.</span><span class="s">parseInt</span><span class="v">(</span><span>br</span><span class="v">.</span><span class="s">readLine</span><span class="v">(</span><span class="v">)</span><span class="v">)</span><span class="v">;</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; PriorityQueue</span><span class="t">&lt;</span><span>Integer</span><span class="t">&gt;</span><span> pq </span><span class="t">=</span><span> </span><span class="o">new</span><span> </span><span class="s">PriorityQueue</span><span class="t">&lt;</span><span class="t">&gt;</span><span class="v">(</span><span class="v">)</span><span class="v">;</span><br><br><span>&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="o">for</span><span> </span><span class="v">(</span><span>int i </span><span class="t">=</span><span> </span><span class="p">0</span><span class="v">;</span><span> i </span><span class="t">&lt;</span><span> n</span><span class="v">;</span><span> i</span><span class="t">++</span><span class="v">)</span><span> </span><span class="v">{</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; int input </span><span class="t">=</span><span> Integer</span><span class="v">.</span><span class="s">parseInt</span><span class="v">(</span><span>br</span><span class="v">.</span><span class="s">readLine</span><span class="v">(</span><span class="v">)</span><span class="v">)</span><span class="v">;</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span><span class="o">if</span><span> </span><span class="v">(</span><span>input </span><span class="t">==</span><span> </span><span class="p">0</span><span class="v">)</span><span> </span><span class="v">{</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span><span class="o">if</span><span> </span><span class="v">(</span><span>pq</span><span class="v">.</span><span class="s">isEmpty</span><span class="v">(</span><span class="v">)</span><span class="v">)</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; bw</span><span class="v">.</span><span class="s">write</span><span class="v">(</span><span class="q">"0\\n"</span><span class="v">)</span><span class="v">;</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span><span class="o">else</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; bw</span><span class="v">.</span><span class="s">write</span><span class="v">(</span><span>pq</span><span class="v">.</span><span class="s">poll</span><span class="v">(</span><span class="v">)</span><span> </span><span class="t">+</span><span> </span><span class="q">"\\n"</span><span class="v">)</span><span class="v">;</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span><span class="v">}</span><span> </span><span class="o">else</span><span> </span><span class="v">{</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; pq</span><span class="v">.</span><span class="s">offer</span><span class="v">(</span><span>input</span><span class="v">)</span><span class="v">;</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </span><span class="v">}</span><br><span>&nbsp; &nbsp; &nbsp; &nbsp; </span><span class="v">}</span></pre>',
        createdDate: '2025-02-11 14:28:46',
        imageUrl: null,
        memberName: '영',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/0c383528-4a39-4a6f-8a5b-db7cc3849409.jpg',
        isAuthor: false,
      },
      {
        articleId: 479,
        articleTitle: '2/11 class4 - 백준 1927 : 최소 힙',
        articleBody:
          '<p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">문제 유형</span></p><p dir="ltr" style="text-align: start;"><span style="">우선 순위 큐</span></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">풀이 방법 도출 과정</span></p><ol><li value="1" class="editor-listitem" style="text-align: start;"><span style="">자연수 X를 배열에 넣고, 가장 작은 값을 출력한 후 제거하는 문제이다.</span></li><li value="2" class="editor-listitem"><span style="">이 문제를 보고 우선순위 큐를 사용해야겠다고 판단했다.</span></li><li value="3" class="editor-listitem"><span style="">또한 최소 힙을 사용하라고 했으므로, 우선순위 큐를 최소 힙으로 구현하면 된다.</span></li><li value="4" class="editor-listitem"><span style="">Java의 </span><span style="">PriorityQueue</span><span style=""> 기본 정렬 방식은 </span><span class="editor-text-bold" style="">최소 힙</span><span style="">이므로, 자바의 PriorityQueue를 사용해서 문제를 풀었다.</span></li></ol><p style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">시간 복잡도</span></p><p dir="ltr" style="text-align: start;"><span style="">우선 순위 큐만 사용하기 때문에 O(nlogn)이다.</span></p><ul><li value="1" class="editor-listitem" style="text-align: start;"><span style="">O(nlogn)</span></li></ul><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><br></p><p dir="ltr" style="text-align: start;"><span class="editor-text-bold" style="">문제 풀이 핵심 코드 이미지 삽입 및 간단 설명</span></p><p dir="ltr" style="text-align: start;"><span style="">우선 순위 큐를 이용하여 문제를 풀이하였다.</span></p><p dir="ltr" style="text-align: start;"><br></p><pre class="codeblock" spellcheck="false" data-gutter="1\r\n2\r\n3\r\n4\r\n5\r\n6\r\n7\r\n8\r\n9\r\n10\r\n11\r\n12\r\n13\r\n14\r\n15\r\n16"><span>PriorityQueue</span><span class="t">&lt;</span><span>Integer</span><span class="t">&gt;</span><span> pq </span><span class="t">=</span><span> </span><span class="o">new</span><span> </span><span class="s">PriorityQueue</span><span class="t">&lt;</span><span class="t">&gt;</span><span class="v">(</span><span class="v">)</span><span class="v">;</span><br><br><span class="o">for</span><span> </span><span class="v">(</span><span>int i </span><span class="t">=</span><span> </span><span class="p">0</span><span class="v">;</span><span> i </span><span class="t">&lt;</span><span> n</span><span class="v">;</span><span> i</span><span class="t">++</span><span class="v">)</span><span> </span><span class="v">{</span><br><span>    int input </span><span class="t">=</span><span> Integer</span><span class="v">.</span><span class="s">parseInt</span><span class="v">(</span><span>br</span><span class="v">.</span><span class="s">readLine</span><span class="v">(</span><span class="v">)</span><span class="v">)</span><span class="v">;</span><br><br><span>    </span><span class="o">if</span><span> </span><span class="v">(</span><span>input </span><span class="t">==</span><span> </span><span class="p">0</span><span class="v">)</span><span> </span><span class="v">{</span><br><span>        </span><span class="o">if</span><span> </span><span class="v">(</span><span>pq</span><span class="v">.</span><span class="s">size</span><span class="v">(</span><span class="v">)</span><span> </span><span class="t">==</span><span> </span><span class="p">0</span><span class="v">)</span><span> </span><span class="v">{</span><br><span>            bw</span><span class="v">.</span><span class="s">append</span><span class="v">(</span><span class="q">"0\\n"</span><span class="v">)</span><span class="v">;</span><br><span>        </span><span class="v">}</span><span> </span><span class="o">else</span><span> </span><span class="v">{</span><br><span>            bw</span><span class="v">.</span><span class="s">append</span><span class="v">(</span><span>pq</span><span class="v">.</span><span class="s">poll</span><span class="v">(</span><span class="v">)</span><span> </span><span class="t">+</span><span> </span><span class="q">"\\n"</span><span class="v">)</span><span class="v">;</span><br><span>        </span><span class="v">}</span><br><span>    </span><span class="v">}</span><span> </span><span class="o">else</span><span> </span><span class="v">{</span><br><span>        pq</span><span class="v">.</span><span class="s">add</span><span class="v">(</span><span>input</span><span class="v">)</span><span class="v">;</span><br><span>    </span><span class="v">}</span><br><span class="v">}</span><br></pre>',
        createdDate: '2025-02-11 11:13:54',
        imageUrl: null,
        memberName: '강수밈밈',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/d3ac6803-3e66-438b-ac07-1e5091891ea5.png',
        isAuthor: false,
      },
      {
        articleId: 242,
        articleTitle: '14일에씀',
        articleBody: '<p><span style="white-space: pre-wrap;">????</span></p>',
        createdDate: '2025-01-13 20:33:36',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
      {
        articleId: 241,
        articleTitle: '아니',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅁㄴㅇ</span></p>',
        createdDate: '2025-01-13 20:29:10',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/d3ac6803-3e66-438b-ac07-1e5091891ea5.png',
        isAuthor: false,
      },
      {
        articleId: 476,
        articleTitle: '2/11 class3 - 백준 1927번 : 최소힙',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">그러네요!!!!</span></p>',
        createdDate: '2025-01-13 19:44:29',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
      {
        articleId: 239,
        articleTitle: '확인했습니다~!',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅋㅌㅊ</span></p>',
        createdDate: '2025-01-13 19:37:18',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
        isAuthor: true,
      },
    ],
    page: {
      size: 6,
      number: 0,
      totalElements: 4,
      totalPages: 1,
    },
  },
};

export const myPageTeamMock = {
  status: 'success',
  code: 200,
  message: null,
  data: [
    {
      teamId: 16,
      teamName: 'aa',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 15,
      teamName: 'scroll',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 14,
      teamName: 'asd',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 13,
      teamName: 'asd',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 10,
      teamName: 'Team QA',
      teamManager: true,
      registerDate: null,
    },
    {
      teamId: 3,
      teamName: '파댕이 밥주기',
      teamManager: false,
      registerDate: null,
    },
    {
      teamId: 2,
      teamName: '장진영팀',
      teamManager: false,
      registerDate: null,
    },
    {
      teamId: 1,
      teamName: '제목제목제목제목제목',
      teamManager: false,
      registerDate: null,
    },
  ],
};

export const myArticlesMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    content: [
      {
        articleId: 242,
        articleTitle: '14일에씀',
        articleBody: '<p><span style="white-space: pre-wrap;">????</span></p>',
        createdDate: '2025-01-13 20:33:36',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 241,
        articleTitle: '아니',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅁㄴㅇ</span></p>',
        createdDate: '2025-01-13 20:29:10',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 240,
        articleTitle:
          '두줄이 넘어가는 제목입니다~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">그러네요!!!!</span></p>',
        createdDate: '2025-01-13 19:44:29',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 239,
        articleTitle: '확인했습니다~!',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅋㅌㅊ</span></p>',
        createdDate: '2025-01-13 19:37:18',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 238,
        articleTitle: '네 알겠습니다~~',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">ㅋㅌㅊㅋㅌㅊ</span></p>',
        createdDate: '2025-01-13 19:36:57',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
      {
        articleId: 228,
        articleTitle: 'asdasd',
        articleBody:
          '<p dir="ltr"><span style="white-space: pre-wrap;">asdasd</span></p>',
        createdDate: '2025-01-02 02:08:25',
        imageUrl: null,
        memberName: '하내안',
        memberImage:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
      },
    ],
    page: {
      size: 6,
      number: 0,
      totalElements: 21,
      totalPages: 4,
    },
  },
};

export const teamCombinedMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    myTeams: [
      {
        teamId: 16,
        teamName: '첫번째',
        teamExplain: '11',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 15,
        teamName: '두번째',
        teamExplain: 'scsc',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 14,
        teamName: '세번째',
        teamExplain: 'qqqq',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 13,
        teamName: '네번째',
        teamExplain: 'qqqq',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 12,
        memberCount: 1,
        streakDays: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-26',
      },
      {
        teamId: 10,
        teamName: '다섯번째',
        teamExplain: 'qa',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 5,
        memberCount: 1,
        streakDays: 0,
        teamAnnouncement: '',
        createdAt: '2024-12-27',
      },
      {
        teamId: 3,
        teamName: '여섯번째',
        teamExplain: '파댕이 밥',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/bae6cb5b-2772-41a7-b56f-808766d0dc50',
        topic: '코딩테스트',
        memberLimit: 10,
        memberCount: 6,
        streakDays: 0,
        teamAnnouncement: '수정테스트(2025/01/02)',
        createdAt: '2024-12-23',
      },
      {
        teamId: 2,
        teamName: '일곱번째',
        teamExplain: '코딩테스트 입니당~~',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 11,
        memberCount: 4,
        streakDays: 0,
        teamAnnouncement: '안녕하세요 공지입니다.',
        createdAt: '2024-12-22',
      },
      {
        teamId: 1,
        teamName: '여덟번째',
        teamExplain: '',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '스터디',
        memberLimit: 20,
        memberCount: 4,
        streakDays: 0,
        teamAnnouncement: '하이하이하이하이',
        createdAt: '2024-12-22',
      },
    ],
    allTeams: {
      content: [
        {
          teamId: 12,
          teamName: '티리티리팀',
          teamExplain: '티리티리팀이에요',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 5,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: '장진영',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/dbda7287-20e9-486a-b17c-6c24f35ac1d8.png',
              memberExplain: '내 이름은 장진영',
              uuid: '358e0577-696f-418a-a0fc-80d63dbfe587',
            },
          ],
        },
        {
          teamId: 11,
          teamName: '티리티리팀',
          teamExplain: '티리티리팀이에요',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 5,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: '장진영',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/dbda7287-20e9-486a-b17c-6c24f35ac1d8.png',
              memberExplain: '내 이름은 장진영',
              uuid: '358e0577-696f-418a-a0fc-80d63dbfe587',
            },
          ],
        },
        {
          teamId: 10,
          teamName: 'Team QA',
          teamExplain: 'qa',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 5,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: '하내안',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
              memberExplain: '하내안입니다',
              uuid: '495892de-1014-4987-b9ea-5137efeefc84',
            },
          ],
        },
        {
          teamId: 9,
          teamName: '현빈 테스트',
          teamExplain: '기모띵',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '코딩테스트',
          memberLimit: 4,
          memberCount: 2,
          streakDays: 0,
          createdAt: '2024-12-27',
          members: [
            {
              memberName: 'ddy',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'hjjuiiiuououououo',
              uuid: '51021d92-eefe-41a7-962a-d0fc029bb866',
            },
            {
              memberName: '강수민',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
              memberExplain: 'Null은 안됨',
              uuid: 'aec0d712-8382-456e-8331-58d705900d98',
            },
          ],
        },
        {
          teamId: 16,
          teamName: 'aa',
          teamExplain: '11',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 12,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-26',
          members: [
            {
              memberName: '하내안',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
              memberExplain: '하내안입니다',
              uuid: '495892de-1014-4987-b9ea-5137efeefc84',
            },
          ],
        },
        {
          teamId: 15,
          teamName: 'scroll',
          teamExplain: 'scsc',
          imageUrl:
            'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
          topic: '스터디',
          memberLimit: 12,
          memberCount: 1,
          streakDays: 0,
          createdAt: '2024-12-26',
          members: [
            {
              memberName: '하내안',
              imageUrl:
                'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
              memberExplain: '하내안입니다',
              uuid: '495892de-1014-4987-b9ea-5137efeefc84',
            },
          ],
        },
      ],
      page: {
        size: 6,
        number: 2,
        totalElements: 27,
        totalPages: 5,
      },
    },
  },
};

export const subjectMock =
  //     {
  //   status: 'success',
  //   code: 200,
  //   message: null,
  //   data: {
  //     articleId: 391,
  //     articleCategory: '스터디 복습',
  //     articleTitle: '주제주제',
  //     articleBody: '<p dir="ltr"><span>이밎이없이</span></p>',
  //     createdDate: '2025-01-21 23:26:34',
  //     imageUrls: [],
  //     authorName: '하내안',
  //     authorImageUrl:
  //       'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
  //   },
  // };
  {
    status: 'success',
    code: 200,
    message: null,
    data: {
      articleId: 98,
      articleCategory: '코딩 테스트',
      articleTitle: '1/15 오늘의 문제',
      articleBody:
        '<p dir="ltr"><span style="white-space: pre-wrap;">안녕하세요~ 평일의 가운데 수요일이네요\uD83D\uDE0A</span></p><p dir="ltr"><span style="white-space: pre-wrap;">오늘도 코딩테스트 풀이를 위해 이 곳까지 오셨다니! 아주 잘하고 있습니다\uD83D\uDC4D</span></p><p><br></p><p dir="ltr"><span style="white-space: pre-wrap;">오늘은 어제보다 쉬운 난이도의 문제 입니다! (힌트: ✨♥️\uD83D\uDC9E♥️✨)</span></p><p dir="ltr"><span style="white-space: pre-wrap;">얼른 빨리 쓱 풀고 쉬러갑시다!! 파이팅\uD83D\uDC23\uD83D\uDC23</span></p><p><br></p><p dir="ltr"><span style="white-space: pre-wrap;">\uD83D\uDCE2</span><b><strong class="editor-text-bold" style="white-space: pre-wrap;"> 1/15 오늘의 문제</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">class2 - 백준 1259번 : </span><a href="https://www.acmicpc.net/problem/1259" target="_blank" rel="noopener noreferrer" class="editor-link"><span style="white-space: pre-wrap;">펠린드롬수</span></a></p><p dir="ltr"><span style="white-space: pre-wrap;">class4 - 백준 1043번 : </span><a href="https://www.acmicpc.net/problem/1043" target="_blank" rel="noopener noreferrer" class="editor-link"><span style="white-space: pre-wrap;">거짓말</span></a></p><p><br></p><p><span style="white-space: pre-wrap;">-----------------------------------------------------------------------------------------------------------</span></p><p dir="ltr"><span style="white-space: pre-wrap;">\uD83D\uDD17</span><b><strong class="editor-text-bold" style="white-space: pre-wrap;"> 문제 풀이 예시 (복사해서 가져가세요!)</strong></b></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">제목 (예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">1/7 class2 - 백준 1003번 : 피보나치 함수</span></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">문제 유형 (예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">2중 for문을 활용한 브루트포스</span></p><p dir="ltr"><span style="white-space: pre-wrap;">DFS, BFS를 이용한 완전탐색</span></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">풀이 방법 도출 과정 (예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">입력 Size가 1000이기 때문에 완전탐색을 활용하여 1초 내에 문제를 해결할 수 있고 판단, 이를 바탕으로 2중 for문을 활용했다.</span></p><p><br></p><p dir="ltr"><b><strong class="editor-text-bold" style="white-space: pre-wrap;">문제 풀이 핵심 코드 이미지 삽입 및 간단 설명(예시)</strong></b></p><p dir="ltr"><span style="white-space: pre-wrap;">2차원 배열을 활용하여 Dynamic Programming을 활용했다.</span></p><p><br></p><p dir="ltr"><img src="https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/article/0f83fdc5-e72d-4d84-a0cc-3222f1b15e18.png" alt="이미지"></p>',
      createdDate: '2025-01-13 00:22:38',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/article/0f83fdc5-e72d-4d84-a0cc-3222f1b15e18.png',
      authorName: '강수밈밈',
      authorImageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/d3ac6803-3e66-438b-ac07-1e5091891ea5.png',
    },
  };

export const teamPageMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    myTeamResponse: {
      teamId: 16,
      teamName: 'aa',
      teamExplain: '11',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
      topic: '스터디',
      memberLimit: 12,
      memberCount: 1,
      streakDays: 0,
      teamAnnouncement: '',
      createdAt: '2024-12-26',
    },
    teamManager: true,
    subjectArticleDateAndTagResponses: [
      {
        subjectDate: '2025-01-02',
        articleCategory: '스터디 예습',
      },
      {
        subjectDate: '2025-01-13',
        articleCategory: '스터디 복습',
      },
      {
        subjectDate: '2025-01-15',
        articleCategory: '코딩 테스트',
      },
    ],
  },
};

export const createPostMock = {
  status: 'success',
  code: 201,
  message: '게시글이 성공적으로 생성되었습니다.',
  data: {
    articleId: 452,
  },
};

export const mutatePostMock = {
  status: 'success',
  code: 200,
  message: '게시글이 성공적으로 수정되었습니다.',
  data: null,
};

export const mutateTeamInfo = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    teamId: 16,
    teamName: 'aa11asd',
    teamExplain: '1122222바뿨보자zz',
    topic: '코딩테스트',
    memberLimit: 50,
    password: '1122',
    teamIconUrl:
      'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/eed4f55a-cf35-497a-bf4b-1f27fb8d1415',
  },
};

export const teamSearchMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    content: [
      {
        teamId: 59,
        teamName: '팀생성1111',
        teamExplain:
          '비번 1111. 아 근데 팀 수정 이미지만 바꿨을 때는 버튼 활성화가 안되네',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/bfb0bae3-0112-4013-b554-9b608a38df63',
        topic: '스터디',
        memberLimit: 50,
        memberCount: 2,
        streakDays: 0,
        createdAt: '2025-01-25',
        members: [
          {
            memberName: '하내안',
            imageUrl:
              'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/489de088-0b90-48bf-a96a-c5d1fdb50f73.png',
            memberExplain: '하내안입니다',
            uuid: '495892de-1014-4987-b9ea-5137efeefc84',
          },
          {
            memberName: '김민욱',
            imageUrl:
              'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
            memberExplain: '.',
            uuid: '11114201-2411-48cf-a6aa-e6de4607956d',
          },
        ],
      },
      {
        teamId: 56,
        teamName: '팀 생성',
        teamExplain: '생성 2번 됨',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 2,
        memberCount: 1,
        streakDays: 0,
        createdAt: '2025-01-24',
        members: [
          {
            memberName: '이지수',
            imageUrl:
              'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
            memberExplain: '난 파댕이가 좋아',
            uuid: 'cfa66118-65c9-4f54-8cc2-a90c71a05e1d',
          },
        ],
      },
      {
        teamId: 37,
        teamName: '팀이름열자자채우기기',
        teamExplain: '팀입니다',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 11,
        memberCount: 1,
        streakDays: 0,
        createdAt: '2025-01-16',
        members: [
          {
            memberName: '김민욱',
            imageUrl:
              'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
            memberExplain: '.',
            uuid: '11114201-2411-48cf-a6aa-e6de4607956d',
          },
        ],
      },
      {
        teamId: 35,
        teamName: 'test용 팀',
        teamExplain: 'test 용입니다',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 2,
        memberCount: 1,
        streakDays: 0,
        createdAt: '2025-01-14',
        members: [
          {
            memberName: '12312312312',
            imageUrl:
              'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
            memberExplain: 'qkrwjwhd ',
            uuid: '8834ddd2-cfbf-482b-9260-d69ba49700b8',
          },
        ],
      },
      {
        teamId: 34,
        teamName: '팀7',
        teamExplain: '많은 팀 테스트중입니다.',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 4,
        memberCount: 1,
        streakDays: 0,
        createdAt: '2025-01-14',
        members: [
          {
            memberName: '민경',
            imageUrl:
              'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
            memberExplain: '하이하이',
            uuid: '73cce880-e310-4632-b546-9b30cb7e843e',
          },
        ],
      },
      {
        teamId: 33,
        teamName: '팀6',
        teamExplain: '많은 팀 테스트중입니다.',
        imageUrl:
          'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
        topic: '코딩테스트',
        memberLimit: 6,
        memberCount: 1,
        streakDays: 0,
        createdAt: '2025-01-14',
        members: [
          {
            memberName: '민경',
            imageUrl:
              'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/default-image.png',
            memberExplain: '하이하이',
            uuid: '73cce880-e310-4632-b546-9b30cb7e843e',
          },
        ],
      },
    ],
    page: {
      size: 6,
      number: 0,
      totalElements: 13,
      totalPages: 3,
    },
  },
};

export const teamAdminMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    teamId: 59,
    teamName: '팀생성1111',
    teamExplain:
      '비번 1111. 아 근데 팀 수정 이미지만 바꿨을 때는 버튼 활성화가 안되네',
    topic: '스터디',
    memberLimit: 50,
    password: '1111',
    teamIconUrl:
      'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/bfb0bae3-0112-4013-b554-9b608a38df63',
  },
};

export const teamMemberMock = {
  status: 'success',
  code: 200,
  message: null,
  data: [
    {
      uuid: '048f6e88-d6ef-4112-bac2-1242fff3f584',
      memberName: '하내안',
      memberExplain: '껄껄껄껄',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/bc29d0d7-134b-4a71-bcdb-023be71422b7',
      registerDate: '2025-02-02',
      isTeamManager: true,
    },
    {
      uuid: 'c7c3d4c4-e8d8-493e-9cf9-e40f7eef41c8',
      memberName: '강수민',
      memberExplain: '강수민',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-03',
      isTeamManager: false,
    },
    {
      uuid: '8a91c3f2-33c3-4c0f-bf34-8123d73e5b9a',
      memberName: '김민수',
      memberExplain: '안녕하세요, 김민수입니다.',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-04',
      isTeamManager: false,
    },
    {
      uuid: '1e8e9f6b-02f4-4852-a8d6-b9273cb984a4',
      memberName: '이정민',
      memberExplain: '프론트엔드 개발자',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-05',
      isTeamManager: true,
    },
    {
      uuid: '99e23f1e-7419-47a1-9499-58e6a40e6223',
      memberName: '박서준',
      memberExplain: '백엔드 개발자',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-06',
      isTeamManager: false,
    },
    {
      uuid: 'c52d43f5-814b-462e-9d51-25c9e16c15c6',
      memberName: '최지현',
      memberExplain: '디자이너',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-07',
      isTeamManager: false,
    },
    {
      uuid: 'da0c80f1-8d59-42b5-94d4-7ec1bcfd3d20',
      memberName: '정도현',
      memberExplain: 'AI 엔지니어',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-08',
      isTeamManager: true,
    },
    {
      uuid: 'c1ef2c3a-2fd9-49e7-8b69-3f49864de118',
      memberName: '홍길동',
      memberExplain: '데이터 분석가',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-09',
      isTeamManager: false,
    },
    {
      uuid: 'e75b4a9e-611b-470e-b3f6-015f8fbce7d5',
      memberName: '이지수',
      memberExplain: '기획자',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-10',
      isTeamManager: false,
    },
    {
      uuid: 'd4e12c8b-8b8f-4a6f-9b5c-078e6248b2c4',
      memberName: '김도윤',
      memberExplain: 'QA 엔지니어',
      imageUrl:
        'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/3bdc4b16-a54e-4d05-bed9-3ffa585cb7e8',
      registerDate: '2025-02-11',
      isTeamManager: true,
    },
  ],
};

export const teamAdminPageMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    teamId: 23,
    teamName: '팀 이름 바뀌나용?',
    teamExplain: '12345',
    topic: '코딩테스트',
    memberLimit: 7,
    password: '3456',
    teamIconUrl:
      'https://pnu-comon-s3-bucket.s3.ap-northeast-2.amazonaws.com/team/default-image.png',
  },
};

export const teamRecruitListMock = {
  status: 'success',
  code: 200,
  message: null,
  data: {
    content: [
      {
        recruitmentId: 1,
        teamRecruitTitle: '팀 모집글 제목',
        teamRecruitBody: '팀 모집글 내용',
        chatUrl: 'https://open.kakao.com/o/g123AbCdE',
        imageUrl: '이미지주소',
        isRecruiting: true,
        memberName: '파댕이',
        createdAt: '2025-01-04',
      },
      {
        recruitmentId: 2,
        teamRecruitTitle: '팀 모집글 제목',
        teamRecruitBody:
          '코딩 테스트 스터디 팀원 모집합니다! 함께 성장하고 도전하며, 효율적으로 코딩 실력을 쌓아갈 열정 있는 분을 찾고 있습니다.혼자가 아닌 팀과 함께 목표를 이루고 싶다면 지금 바로 참여하세요! 💻✨',
        chatUrl: 'https://open.kakao.com/o/g123AbCdE',
        imageUrl: '이미지주소',
        isRecruiting: false,
        memberName: '파댕이2',
        createdAt: '2025-01-04',
      },
      {
        recruitmentId: 3,
        teamRecruitTitle: '팀 모집글 제목',
        teamRecruitBody: '팀 모집글 내용',
        chatUrl: 'https://open.kakao.com/o/g123AbCdE',
        imageUrl: '이미지주소',
        isRecruiting: true,
        memberName: '파댕이',
        createdAt: '2025-01-04',
      },
      {
        recruitmentId: 4,
        teamRecruitTitle: '팀 모집글 제4',
        teamRecruitBody: '팀 모집글 내용',
        chatUrl: 'https://open.kakao.com/o/g123AbCdE',
        imageUrl: '이미지주소',
        isRecruiting: true,
        memberName: '파댕이',
        createdAt: '2025-01-04',
      },
      {
        recruitmentId: 5,
        teamRecruitTitle: '팀 모집글 제목5',
        teamRecruitBody:
          '코딩 테스트 스터디 팀원 모집합니다! 함께 성장하고 도전하며, 효율적으로 코딩 실력을 쌓아갈 열정 있는 분을 찾고 있습니다.혼자가 아닌 팀과 함께 목표를 이루고 싶다면 지금 바로 참여하세요! 💻✨',
        chatUrl: 'https://open.kakao.com/o/g123AbCdE',
        imageUrl: '이미지주소',
        isRecruiting: false,
        memberName: '파댕이2',
        createdAt: '2025-01-04',
      },
      {
        recruitmentId: 6,
        teamRecruitTitle: '팀 모집글 제목6',
        teamRecruitBody: '팀 모집글 내용',
        chatUrl: 'https://open.kakao.com/o/g123AbCdE',
        imageUrl: '이미지주소',
        isRecruiting: true,
        memberName: '파댕이',
        createdAt: '2025-01-04',
      },
    ],
    page: {
      size: 5,
      number: 0,
      totalElements: 6,
      totalPages: 2,
    },
  },
};
