import { Heading } from "../heading";
import { Info, Warning } from "./callouts";
import { CodeBlock } from "./code-block";
import { slugify } from "../cn";
import { HTMLAttributes } from "react";
import Image from "next/image";

export const mdxComponents = {
  Info,
  Warning,
  h1: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={1} id={slugify(String(children))} {...props}>
      {children}
    </Heading>
  ),
  h2: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={2} id={slugify(String(children))} {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <Heading level={3} id={slugify(String(children))} {...props}>
      {children}
    </Heading>
  ),
  pre: (props: any) => <CodeBlock {...props.children.props} />,
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className={`${props.className || ""
        } bg-gray-800/50 px-1.5 py-0.5 rounded text-sm font-mono`}
    />
  ),
  img: ({
    src,
    alt,
    width: _width,
    height: _height,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src) return null;
    return (
      <Image
        src={src as string}
        alt={alt || ""}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="max-w-[400px] aspect-auto mx-auto rounded-lg"
        {...props}
      />
    );
  },
};
