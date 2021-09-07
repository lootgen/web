import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type CreateLootBagInput = {
  items: Array<Scalars['String']>;
};

export type FetchLootBagInput = {
  id: Scalars['Int'];
};

export type Item = {
  __typename?: 'Item';
  id: Scalars['ID'];
  name: Scalars['String'];
  created: Scalars['DateTime'];
};

export type LootBag = {
  __typename?: 'LootBag';
  id: Scalars['Int'];
  created: Scalars['DateTime'];
  items: Array<LootItem>;
};

export type LootItem = {
  __typename?: 'LootItem';
  id: Scalars['ID'];
  item: Item;
  bag: LootBag;
  order: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createLootBag: LootBag;
};


export type MutationCreateLootBagArgs = {
  input: CreateLootBagInput;
};

export type Query = {
  __typename?: 'Query';
  lootBag: LootBag;
};


export type QueryLootBagArgs = {
  input: FetchLootBagInput;
};

export type CreateLootBagMutationVariables = Exact<{
  items: Array<Scalars['String']> | Scalars['String'];
}>;


export type CreateLootBagMutation = { __typename?: 'Mutation', createLootBag: { __typename?: 'LootBag', id: number, items: Array<{ __typename?: 'LootItem', item: { __typename?: 'Item', name: string } }> } };


export const CreateLootBagDocument = gql`
    mutation CreateLootBag($items: [String!]!) {
  createLootBag(input: {items: $items}) {
    id
    items {
      item {
        name
      }
    }
  }
}
    `;
export type CreateLootBagMutationFn = Apollo.MutationFunction<CreateLootBagMutation, CreateLootBagMutationVariables>;

/**
 * __useCreateLootBagMutation__
 *
 * To run a mutation, you first call `useCreateLootBagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLootBagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLootBagMutation, { data, loading, error }] = useCreateLootBagMutation({
 *   variables: {
 *      items: // value for 'items'
 *   },
 * });
 */
export function useCreateLootBagMutation(baseOptions?: Apollo.MutationHookOptions<CreateLootBagMutation, CreateLootBagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLootBagMutation, CreateLootBagMutationVariables>(CreateLootBagDocument, options);
      }
export type CreateLootBagMutationHookResult = ReturnType<typeof useCreateLootBagMutation>;
export type CreateLootBagMutationResult = Apollo.MutationResult<CreateLootBagMutation>;
export type CreateLootBagMutationOptions = Apollo.BaseMutationOptions<CreateLootBagMutation, CreateLootBagMutationVariables>;