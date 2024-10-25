import React, { useState, useContext } from 'react';
import { Button, TextInput, Stack, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AuthContext } from '@/AuthContext';
import { api } from '@/services/api';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ opened, onClose }) => {
  const { setAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      password: '',
    },
  });

  const handleSubmit = async (values: { password: string }) => {
    setLoading(true);
    form.clearErrors();
    try {
      await api.post('/login', { password: values.password });
      setAuthenticated(true);
      localStorage.setItem('authenticated', 'true');
      form.reset();
      onClose(); // Close the modal upon successful login
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        form.setFieldError('password', 'Invalid password.');
      } else {
        console.error('Login error:', error);
        form.setFieldError('password', 'An unexpected error occurred.');
      }
      setAuthenticated(false);
      localStorage.removeItem('authenticated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Sign In" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            type="password"
            {...form.getInputProps('password')}
            label="Password"
            placeholder="Enter password"
            required
          />
          <Button type="submit" loading={loading}>
            Login
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default LoginModal;