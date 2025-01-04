import { handleCookieOnRedirect } from '@/utils/cookie';

import { usePrompt } from '@/hooks/usePrompt';

import { GradientGlassPanel } from '@/components/commons/GradientGlassPanel';
import { Spacer } from '@/components/commons/Spacer';

import { Fragment, useEffect, useMemo } from 'react';

import { formTextInputAtom, formTextareaAtom, imageAtom } from '@/store/form';
import { EnrollForm } from '@/templates/User/EnrollForm';
import { serializeForm } from '@/templates/User/utils';
import { useAtom } from 'jotai';

const EnrollTemplate = () => {
  useEffect(() => {
    handleCookieOnRedirect();
  }, []);

  const [memberName] = useAtom(formTextInputAtom);
  const [memberExplain] = useAtom(formTextareaAtom);
  const [image] = useAtom(imageAtom);

  const cache = useMemo(
    () => serializeForm(memberName, memberExplain, image),
    []
  );

  usePrompt(cache !== serializeForm(memberName, memberExplain, image));

  return (
    <Fragment>
      <GradientGlassPanel>
        <EnrollForm h={767} />
      </GradientGlassPanel>
      <Spacer h={577} />
    </Fragment>
  );
};

export default EnrollTemplate;
