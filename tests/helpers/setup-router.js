export default function({ container }) {
  const router = container.lookup('router:main');
  router.setupRouter();
}
