import { Banner } from '@primer/react';
import DefaultLayout from 'infra/interfaces/DefaultLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RegisterConfirmPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const { activationTokenId } = router.query;

  useEffect(() => {
    if (!activationTokenId) {
      return;
    }
    sendActivationRequest();
    async function sendActivationRequest() {
      try {
        const response = await fetch(
          `erro/api/v1/activations/${activationTokenId}`,
          {
            method: 'PATCH',
          },
        );
        const responseBody = await response.json();
        if (response.status === 200) {
          setConfirmed('sucess');
          return;
        }
        setErrorMessage(`${responseBody.message} \n ${responseBody.action}`);
        setConfirmed('failed');
      } catch (error) {
        setErrorMessage(
          'Falha no acesso ao servidor. \n Tente novamente mais tarde!',
        );
        setConfirmed('failed');
      }
    }
  }, [activationTokenId]);

  return (
    <DefaultLayout>
      {confirmed === 'loading' && (
        <Banner variant="info">
          <Banner.Title>Aguardando retorno do servidor</Banner.Title>
        </Banner>
      )}
      {confirmed === 'sucess' && (
        <Banner variant="success">
          <Banner.Title>Confirmação</Banner.Title>
          <Banner.Description>
            Seu cadastro foi confirmado com sucesso Clique{' '}
            <Link href="/">aqui</Link> para realizar o login no sistema
          </Banner.Description>
        </Banner>
      )}
      {confirmed === 'failed' && (
        <Banner variant="critical">
          <Banner.Title>Erro na confirmação</Banner.Title>
          <Banner.Description style={{ whiteSpace: 'pre-line' }}>
            {errorMessage}
          </Banner.Description>
        </Banner>
      )}
    </DefaultLayout>
  );
}
