import { useQuery } from '@tanstack/react-query';
export default function Posts() {
  const { data } = useQuery({ queryKey: ['user'] });
  console.log(data);

  return <div>This is posts page</div>;
}
