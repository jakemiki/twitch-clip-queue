import React from 'react';

interface ForkMeOnGithubProps {
  href: string;
}

function ForkMeOnGithub({ href }: ForkMeOnGithubProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <img
        loading="lazy"
        width="128"
        height="128"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
        className="absolute top-0 right-0 fork-on-github"
        alt="Fork me on GitHub"
      />
    </a>
  );
}

export default ForkMeOnGithub;
