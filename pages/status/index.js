import DefaultLayout from 'infra/interfaces/DefaultLayout';
import useSWR from 'swr';
import { Banner, Heading, Stack } from '@primer/react';
import { Card } from '@primer/react/experimental';

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}
export default function StatusPage() {
  return (
    <DefaultLayout contentWidth="medium">
      <div align="center">
        <Heading variant="large">Health Check</Heading>
        <Heading variant="medium">Status</Heading>
        <UpdateAt />
        <Stack>
          <Heading variant="medium">Dados do Banco</Heading>
          <BaseData />
        </Stack>
      </div>
    </DefaultLayout>
  );
}

function UpdateAt() {
  const { data, isLoading } = useSWR('/api/v1/status', fetchAPI);
  let updateAtText = 'Carregando ...';
  if (!isLoading) {
    updateAtText = new Date(data.update_at).toLocaleString('pt-BR');
  }
  return (
    <Banner layout="compact">
      <Banner.Title></Banner.Title>
      <Banner.Description>
        Última atualização: {updateAtText}
      </Banner.Description>
    </Banner>
  );
}

function BaseData() {
  setTimeout(() => {}, 10000);
  const { data, isLoading } = useSWR('/api/v1/status', fetchAPI);
  let baseVersion = '';
  let activeUsers = '';
  let maxConnections = '';
  if (data) {
    baseVersion =
      data.database?.version || 'Disponível somente para administradores';
    activeUsers = data.database?.active_users || 'Não disponível';
    maxConnections = data.database?.max_connections || 'Não disponível';
  }

  if (isLoading || !data) return;

  return (
    <Stack direction={{ narrow: 'vertical', regular: 'horizontal' }}>
      <Stack.Item grow>
        <Card>
          <Card.Heading>Versão</Card.Heading>
          <Card.Description>{baseVersion}</Card.Description>
          <Card.Metadata>Uso neste instante</Card.Metadata>
        </Card>
      </Stack.Item>
      <Stack.Item grow>
        <Card>
          <Card.Heading>Usuários ativos</Card.Heading>
          <Card.Description>{activeUsers}</Card.Description>
          <Card.Metadata>Uso neste instante</Card.Metadata>
        </Card>
      </Stack.Item>
      <Stack.Item grow>
        <Card>
          <Card.Heading>Máximo de conexões</Card.Heading>
          <Card.Description>{maxConnections}</Card.Description>
          <Card.Metadata>Uso neste instante</Card.Metadata>
        </Card>
      </Stack.Item>
    </Stack>
  );
}
