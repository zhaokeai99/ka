import useAuth from '@/components/Hooks/useAuth';

const Auth = ({ children, sn }: { children: any; sn: string }) => {
  const show = useAuth({ sn });

  return show ? children : null;
};

export default Auth;
